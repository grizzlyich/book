from django.conf import settings
from django.db import models
from common.upload_security import secure_media_upload_path


def book_cover_upload_to(instance, filename):
    return secure_media_upload_path('books/covers', filename)


class Book(models.Model):
    STATUS_AVAILABLE = 'available'
    STATUS_RESERVED = 'reserved'
    STATUS_EXCHANGED = 'exchanged'

    STATUS_CHOICES = [
        (STATUS_AVAILABLE, 'Доступна'),
        (STATUS_RESERVED, 'Зарезервирована'),
        (STATUS_EXCHANGED, 'Обменена'),
    ]

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='books')
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    genre = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    condition = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=120, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    cover = models.ImageField(upload_to=book_cover_upload_to, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_AVAILABLE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} — {self.author}'
