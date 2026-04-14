from rest_framework import serializers
from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_username', 'content', 'read', 'created_at']
        read_only_fields = ['sender', 'read']


class SendMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['content']


class ConversationListSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            'id', 'listing', 'listing_title', 'other_user',
            'last_message', 'unread_count', 'updated_at',
        ]

    def get_other_user(self, obj):
        request_user = self.context['request'].user
        other = obj.participants.exclude(id=request_user.id).first()
        if other:
            return {
                'id': other.id,
                'username': other.username,
                'avatar': other.profile.avatar.url if hasattr(other, 'profile') and other.profile.avatar else None,
            }
        return None

    def get_last_message(self, obj):
        last = obj.messages.order_by('-created_at').first()
        if last:
            return {
                'content': last.content[:50],
                'created_at': last.created_at,
                'sender': last.sender.username,
            }
        return None

    def get_unread_count(self, obj):
        request_user = self.context['request'].user
        return obj.messages.filter(read=False).exclude(sender=request_user).count()


class ConversationCreateSerializer(serializers.Serializer):
    listing_id = serializers.IntegerField()
    message = serializers.CharField()

    def validate_listing_id(self, value):
        from listings.models import Listing
        try:
            Listing.objects.get(pk=value)
        except Listing.DoesNotExist:
            raise serializers.ValidationError('Listing does not exist.')
        return value


class ConversationDetailSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    listing_image = serializers.ImageField(source='listing.image', read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = [
            'id', 'listing', 'listing_title', 'listing_image',
            'other_user', 'messages', 'created_at', 'updated_at',
        ]

    def get_other_user(self, obj):
        request_user = self.context['request'].user
        other = obj.participants.exclude(id=request_user.id).first()
        if other:
            return {
                'id': other.id,
                'username': other.username,
                'avatar': other.profile.avatar.url if hasattr(other, 'profile') and other.profile.avatar else None,
            }
        return None