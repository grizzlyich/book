from django.db.models import Q
from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer


class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        mode = self.request.query_params.get('mode')
        queryset = Review.objects.select_related('author', 'recipient', 'exchange')

        if mode == 'written':
            return queryset.filter(author=user)
        if mode == 'received':
            return queryset.filter(recipient=user)
        return queryset.filter(Q(author=user) | Q(recipient=user))

    def perform_create(self, serializer):
        serializer.save()


class UserReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Review.objects.select_related('author', 'recipient', 'exchange').filter(recipient_id=user_id)
