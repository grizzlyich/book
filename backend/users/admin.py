from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Дополнительно', {'fields': ('city', 'address', 'latitude', 'longitude', 'avatar', 'bio')}),
    )
    list_display = ('id', 'username', 'email', 'city', 'is_staff')
    search_fields = ('username', 'email', 'city')
