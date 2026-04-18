from rest_framework import serializers
from django.utils import timezone
from .models import MeetupCategory, Meetup, MeetupRSVP


class MeetupCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetupCategory
        fields = ['id', 'name', 'slug', 'icon', 'color']


class MeetupRSVPSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = MeetupRSVP
        fields = ['id', 'user', 'username', 'avatar', 'meetup', 'status', 'created_at']
        read_only_fields = ['user']

    def get_avatar(self, obj):
        if hasattr(obj.user, 'profile') and obj.user.profile.avatar:
            return obj.user.profile.avatar.url
        return None


class MeetupListSerializer(serializers.ModelSerializer):
    creator_username = serializers.CharField(source='creator.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True, default='#4F46E5')
    attendee_count = serializers.SerializerMethodField()

    class Meta:
        model = Meetup
        fields = [
            'id', 'title', 'description', 'location_text', 'latitude', 'longitude',
            'meetup_datetime', 'category', 'category_name', 'category_color',
            'creator', 'creator_username', 'max_attendees', 'status',
            'image', 'attendee_count', 'created_at',
        ]

    def get_attendee_count(self, obj):
        return obj.rsvps.filter(status='going').count()


class MeetupDetailSerializer(serializers.ModelSerializer):
    creator_username = serializers.CharField(source='creator.username', read_only=True)
    creator_avatar = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True, default='#4F46E5')
    rsvps = MeetupRSVPSerializer(many=True, read_only=True)
    attendee_count = serializers.SerializerMethodField()
    user_rsvp = serializers.SerializerMethodField()

    class Meta:
        model = Meetup
        fields = [
            'id', 'title', 'description', 'location_text', 'latitude', 'longitude',
            'meetup_datetime', 'category', 'category_name', 'category_color',
            'creator', 'creator_username', 'creator_avatar', 'max_attendees',
            'status', 'image', 'rsvps', 'attendee_count', 'user_rsvp',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['creator']

    def get_creator_avatar(self, obj):
        if hasattr(obj.creator, 'profile') and obj.creator.profile.avatar:
            return obj.creator.profile.avatar.url
        return None

    def get_attendee_count(self, obj):
        return obj.rsvps.filter(status='going').count()

    def get_user_rsvp(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            rsvp = obj.rsvps.filter(user=request.user).first()
            if rsvp:
                return rsvp.status
        return None


class MeetupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meetup
        fields = [
            'title', 'description', 'location_text', 'latitude', 'longitude',
            'meetup_datetime', 'category', 'max_attendees', 'image',
        ]

    def validate_meetup_datetime(self, value):
        if value < timezone.now():
            raise serializers.ValidationError('Meetup date must be in the future.')
        return value