from rest_framework import serializers
from .models import Category, Listing


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon']


class ListingListSerializer(serializers.ModelSerializer):
    seller_username = serializers.CharField(source='seller.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'listing_type', 'category', 'category_name',
            'price', 'condition', 'status', 'image', 'location',
            'seller', 'seller_username', 'created_at',
        ]


class ListingDetailSerializer(serializers.ModelSerializer):
    seller_username = serializers.CharField(source='seller.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'title', 'description', 'listing_type', 'category',
            'category_name', 'price', 'condition', 'status', 'image',
            'location', 'seller', 'seller_username', 'created_at', 'updated_at',
        ]
        read_only_fields = ['seller']


class ListingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = [
            'title', 'description', 'listing_type', 'category',
            'price', 'condition', 'image', 'location',
        ]