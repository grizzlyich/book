from django.urls import path
from .views import BookListCreateView, BookDetailView, MyBooksView, BookMapView

urlpatterns = [
    path('', BookListCreateView.as_view(), name='book-list-create'),
    path('my/', MyBooksView.as_view(), name='my-books'),
    path('map/', BookMapView.as_view(), name='book-map'),
    path('<int:pk>/', BookDetailView.as_view(), name='book-detail'),
]
