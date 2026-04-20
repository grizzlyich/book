from django.contrib import admin
from .models import ExchangeRequest


@admin.register(ExchangeRequest)
class ExchangeRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'book', 'requester', 'owner', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('book__title', 'requester__username', 'owner__username')
