from rest_framework import serializers
from .models import User
from common.upload_security import clean_plain_text, validate_image_upload


class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'city', 'latitude', 'longitude', 'avatar', 'bio')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password', 'first_name', 'last_name',
            'city', 'address', 'latitude', 'longitude', 'avatar', 'bio'
        )

    def validate_username(self, value):
        return clean_plain_text(value, field_name='username', max_length=150, allow_blank=False)

    def validate_first_name(self, value):
        return clean_plain_text(value, field_name='first_name', max_length=150)

    def validate_last_name(self, value):
        return clean_plain_text(value, field_name='last_name', max_length=150)

    def validate_city(self, value):
        return clean_plain_text(value, field_name='city', max_length=120)

    def validate_address(self, value):
        return clean_plain_text(value, field_name='address', max_length=255)

    def validate_bio(self, value):
        return clean_plain_text(value, field_name='bio', max_length=1000)

    def validate_avatar(self, value):
        if value:
            validate_image_upload(value, max_size=3 * 1024 * 1024)
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'city', 'address', 'latitude', 'longitude', 'avatar', 'bio'
        )
        read_only_fields = ('id', 'username', 'email')

    def validate_first_name(self, value):
        return clean_plain_text(value, field_name='first_name', max_length=150)

    def validate_last_name(self, value):
        return clean_plain_text(value, field_name='last_name', max_length=150)

    def validate_city(self, value):
        return clean_plain_text(value, field_name='city', max_length=120)

    def validate_address(self, value):
        return clean_plain_text(value, field_name='address', max_length=255)

    def validate_bio(self, value):
        return clean_plain_text(value, field_name='bio', max_length=1000)

    def validate_avatar(self, value):
        if value:
            validate_image_upload(value, max_size=3 * 1024 * 1024)
        return value
