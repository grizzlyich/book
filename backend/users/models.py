from django.contrib.auth.models import AbstractUser
from django.db import models
from common.upload_security import secure_media_upload_path


def avatar_upload_to(instance, filename):
    return secure_media_upload_path('avatars', filename)


class User(AbstractUser):
    email = models.EmailField(unique=True)
    city = models.CharField(max_length=120, blank=True)
    address = models.CharField(max_length=255, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    avatar = models.ImageField(upload_to=avatar_upload_to, blank=True, null=True)
    bio = models.TextField(blank=True)

    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username
