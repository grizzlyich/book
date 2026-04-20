from rest_framework import serializers
from .models import Book
from users.serializers import UserPublicSerializer


class BookSerializer(serializers.ModelSerializer):
    owner = UserPublicSerializer(read_only=True)

    class Meta:
        model = Book
        fields = (
            'id', 'owner', 'title', 'author', 'genre', 'description', 'condition',
            'city', 'latitude', 'longitude', 'cover', 'status', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at')


class BookMapSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = Book
        fields = ('id', 'title', 'author', 'city', 'latitude', 'longitude', 'owner_name', 'status')
