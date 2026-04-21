from rest_framework import serializers
from .models import Book
from users.serializers import UserPublicSerializer
from common.upload_security import clean_plain_text, validate_image_upload


class BookSerializer(serializers.ModelSerializer):
    owner = UserPublicSerializer(read_only=True)
    cover = serializers.SerializerMethodField(read_only=True)
    cover_file = serializers.ImageField(write_only=True, required=False, source='cover')

    class Meta:
        model = Book
        fields = (
            'id', 'owner', 'title', 'author', 'genre', 'description', 'condition',
            'city', 'latitude', 'longitude', 'cover', 'cover_file', 'status', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at')


    def get_cover(self, obj):
        if not obj.cover:
            return None
        request = self.context.get('request')
        try:
            url = obj.cover.url
        except Exception:
            return None
        if url.startswith('http://') or url.startswith('https://'):
            return url
        if request:
            return request.build_absolute_uri(url)
        return url

    def validate_title(self, value):
        return clean_plain_text(value, field_name='title', max_length=255, allow_blank=False)

    def validate_author(self, value):
        return clean_plain_text(value, field_name='author', max_length=255, allow_blank=False)

    def validate_genre(self, value):
        return clean_plain_text(value, field_name='genre', max_length=100)

    def validate_description(self, value):
        return clean_plain_text(value, field_name='description', max_length=2000)

    def validate_condition(self, value):
        return clean_plain_text(value, field_name='condition', max_length=100)

    def validate_city(self, value):
        return clean_plain_text(value, field_name='city', max_length=120)

    def validate_cover_file(self, value):
        if value:
            validate_image_upload(value)
        return value


class BookMapSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = Book
        fields = ('id', 'title', 'author', 'city', 'latitude', 'longitude', 'owner_name', 'status')
