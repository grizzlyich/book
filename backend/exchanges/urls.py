from django.urls import path
from .views import ExchangeRequestListCreateView, ExchangeRequestDetailView, CancelExchangeRequestView

urlpatterns = [
    path('', ExchangeRequestListCreateView.as_view(), name='exchange-list-create'),
    path('<int:pk>/', ExchangeRequestDetailView.as_view(), name='exchange-detail'),
    path('<int:pk>/cancel/', CancelExchangeRequestView.as_view(), name='exchange-cancel'),
]
