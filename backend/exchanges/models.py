from django.conf import settings
from django.db import models
from books.models import Book


class ExchangeRequest(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_ACCEPTED = 'accepted'
    STATUS_REJECTED = 'rejected'
    STATUS_CANCELLED = 'cancelled'
    STATUS_COMPLETED = 'completed'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Ожидает'),
        (STATUS_ACCEPTED, 'Принята'),
        (STATUS_REJECTED, 'Отклонена'),
        (STATUS_CANCELLED, 'Отменена'),
        (STATUS_COMPLETED, 'Завершена'),
    ]

    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='exchange_requests')
    requester = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_exchange_requests')
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_exchange_requests')
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(
                fields=['book', 'requester'],
                condition=models.Q(status__in=['pending', 'accepted']),
                name='unique_active_request_per_book_requester',
            )
        ]

    def __str__(self):
        return f'Заявка #{self.pk} на {self.book.title}'
