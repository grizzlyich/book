from rest_framework import serializers
from .models import ExchangeRequest
from books.models import Book
from books.serializers import BookSerializer
from users.serializers import UserPublicSerializer


class ExchangeRequestSerializer(serializers.ModelSerializer):
    requester = UserPublicSerializer(read_only=True)
    owner = UserPublicSerializer(read_only=True)
    book = BookSerializer(read_only=True)
    book_id = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all(), source='book', write_only=True)

    class Meta:
        model = ExchangeRequest
        fields = (
            'id', 'book', 'book_id', 'requester', 'owner', 'message',
            'status', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'requester', 'owner', 'status', 'created_at', 'updated_at', 'book')

    def validate(self, attrs):
        book = attrs['book']
        user = self.context['request'].user

        if book.owner == user:
            raise serializers.ValidationError('Нельзя отправить заявку на свою книгу.')
        if book.status != Book.STATUS_AVAILABLE:
            raise serializers.ValidationError('Эта книга сейчас недоступна для обмена.')
        return attrs

    def create(self, validated_data):
        request = self.context['request']
        book = validated_data['book']
        return ExchangeRequest.objects.create(
            book=book,
            requester=request.user,
            owner=book.owner,
            message=validated_data.get('message', ''),
        )


class ExchangeStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeRequest
        fields = ('status',)

    def validate_status(self, value):
        allowed = {
            ExchangeRequest.STATUS_ACCEPTED,
            ExchangeRequest.STATUS_REJECTED,
            ExchangeRequest.STATUS_COMPLETED,
        }
        if value not in allowed:
            raise serializers.ValidationError('Разрешены только статусы accepted, rejected, completed.')
        return value
