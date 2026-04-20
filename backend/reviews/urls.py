from django.urls import path
from .views import ReviewListCreateView, UserReviewListView

urlpatterns = [
    path('', ReviewListCreateView.as_view(), name='review-list-create'),
    path('user/<int:user_id>/', UserReviewListView.as_view(), name='user-reviews'),
]
