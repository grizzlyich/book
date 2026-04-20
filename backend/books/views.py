from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Book
from .serializers import BookSerializer, BookMapSerializer
from .permissions import IsOwnerOrReadOnly


class BookListCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.select_related('owner').all()
    serializer_class = BookSerializer
    filterset_fields = ['genre', 'city', 'status', 'owner']
    search_fields = ['title', 'author', 'description', 'genre', 'city', 'owner__username']
    ordering_fields = ['created_at', 'title', 'author']

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]


class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.select_related('owner').all()
    serializer_class = BookSerializer
    permission_classes = [IsOwnerOrReadOnly]


class MyBooksView(generics.ListAPIView):
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Book.objects.select_related('owner').filter(owner=self.request.user)


class BookMapView(generics.ListAPIView):
    serializer_class = BookMapSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Book.objects.filter(latitude__isnull=False, longitude__isnull=False, status=Book.STATUS_AVAILABLE)
