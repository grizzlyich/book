from django.contrib import admin
from .models import Book


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'author', 'owner', 'city', 'status', 'created_at')
    list_filter = ('status', 'genre', 'city')
    search_fields = ('title', 'author', 'description', 'owner__username')
