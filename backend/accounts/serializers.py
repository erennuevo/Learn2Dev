from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User, Profile
from django.contrib.auth import authenticate


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'username'


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    listing_count = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'username', 'email', 'bio', 'avatar', 'location', 'phone', 'listing_count', 'created_at']
        read_only_fields = ['created_at']

    def get_listing_count(self, obj):
        return obj.user.listings.filter(status='available').count()


class PublicProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    listing_count = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'username', 'bio', 'avatar', 'location', 'listing_count', 'created_at']

    def get_listing_count(self, obj):
        return obj.user.listings.filter(status='available').count()