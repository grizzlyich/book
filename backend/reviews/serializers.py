from rest_framework import serializers
from .models import Review
from exchanges.models import ExchangeRequest
from users.serializers import UserPublicSerializer


class ReviewSerializer(serializers.ModelSerializer):
    author = UserPublicSerializer(read_only=True)
    recipient = UserPublicSerializer(read_only=True)
    exchange_id = serializers.PrimaryKeyRelatedField(queryset=ExchangeRequest.objects.all(), source='exchange', write_only=True)

    class Meta:
        model = Review
        fields = ('id', 'exchange_id', 'author', 'recipient', 'rating', 'text', 'created_at')
        read_only_fields = ('id', 'author', 'recipient', 'created_at')

    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError('Оценка должна быть от 1 до 5.')
        return value

    def validate(self, attrs):
        exchange = attrs['exchange']
        user = self.context['request'].user

        if exchange.status != ExchangeRequest.STATUS_COMPLETED:
            raise serializers.ValidationError('Отзыв можно оставить только после завершённого обмена.')
        if exchange.requester != user and exchange.owner != user:
            raise serializers.ValidationError('Вы не участвовали в этом обмене.')
        if hasattr(exchange, 'review'):
            raise serializers.ValidationError('На этот обмен отзыв уже оставлен.')
        return attrs

    def create(self, validated_data):
        exchange = validated_data['exchange']
        user = self.context['request'].user
        recipient = exchange.owner if exchange.requester == user else exchange.requester

        return Review.objects.create(
            exchange=exchange,
            author=user,
            recipient=recipient,
            rating=validated_data['rating'],
            text=validated_data.get('text', ''),
        )
