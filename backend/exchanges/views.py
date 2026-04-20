from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.db.models import Q

from .models import ExchangeRequest
from .serializers import ExchangeRequestSerializer, ExchangeStatusUpdateSerializer
from books.models import Book


class ExchangeRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = ExchangeRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ExchangeRequest.objects.select_related('book', 'requester', 'owner').filter(
            Q(requester=user) | Q(owner=user)
        )

    def perform_create(self, serializer):
        serializer.save()


class ExchangeRequestDetailView(generics.RetrieveUpdateAPIView):
    queryset = ExchangeRequest.objects.select_related('book', 'requester', 'owner').all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ExchangeStatusUpdateSerializer
        return ExchangeRequestSerializer

    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        if obj.requester != user and obj.owner != user:
            raise PermissionDenied('У вас нет доступа к этой заявке.')
        return obj

    def update(self, request, *args, **kwargs):
        exchange = self.get_object()
        if exchange.owner != request.user:
            raise PermissionDenied('Только владелец книги может менять статус заявки.')

        serializer = self.get_serializer(exchange, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        new_status = serializer.validated_data['status']

        exchange.status = new_status
        exchange.save(update_fields=['status', 'updated_at'])

        if new_status == ExchangeRequest.STATUS_ACCEPTED:
            exchange.book.status = Book.STATUS_RESERVED
            exchange.book.save(update_fields=['status', 'updated_at'])
        elif new_status == ExchangeRequest.STATUS_COMPLETED:
            exchange.book.status = Book.STATUS_EXCHANGED
            exchange.book.save(update_fields=['status', 'updated_at'])
        elif new_status == ExchangeRequest.STATUS_REJECTED:
            active_exists = exchange.book.exchange_requests.exclude(pk=exchange.pk).filter(status=ExchangeRequest.STATUS_ACCEPTED).exists()
            if not active_exists:
                exchange.book.status = Book.STATUS_AVAILABLE
                exchange.book.save(update_fields=['status', 'updated_at'])

        response_serializer = ExchangeRequestSerializer(exchange, context={'request': request})
        return Response(response_serializer.data)


class CancelExchangeRequestView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            exchange = ExchangeRequest.objects.select_related('book').get(pk=pk)
        except ExchangeRequest.DoesNotExist:
            raise ValidationError('Заявка не найдена.')

        if exchange.requester != request.user:
            raise PermissionDenied('Отменить заявку может только тот, кто её отправил.')
        if exchange.status not in [ExchangeRequest.STATUS_PENDING, ExchangeRequest.STATUS_ACCEPTED]:
            raise ValidationError('Эту заявку уже нельзя отменить.')

        exchange.status = ExchangeRequest.STATUS_CANCELLED
        exchange.save(update_fields=['status', 'updated_at'])

        if exchange.book.status == Book.STATUS_RESERVED:
            exchange.book.status = Book.STATUS_AVAILABLE
            exchange.book.save(update_fields=['status', 'updated_at'])

        return Response({'detail': 'Заявка отменена.'}, status=status.HTTP_200_OK)
