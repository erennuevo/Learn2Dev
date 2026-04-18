from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from listings.models import Listing
from meetups.models import Meetup
from .models import Conversation, Message
from .serializers import (
    ConversationListSerializer,
    ConversationDetailSerializer,
    ConversationCreateSerializer,
    MessageSerializer,
    SendMessageSerializer,
)
from .permissions import IsParticipant


class ConversationListView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ConversationCreateSerializer
        return ConversationListSerializer

    def get_queryset(self):
        return Conversation.objects.filter(
            participants=self.request.user
        ).select_related('listing', 'meetup').prefetch_related('participants', 'messages')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated = serializer.validated_data
        meetup_id = validated.get('meetup_id')
        listing_id = validated.get('listing_id')

        if meetup_id:
            meetup = Meetup.objects.get(pk=meetup_id)

            existing = Conversation.objects.filter(
                meetup=meetup,
                participants=request.user,
            ).first()

            if existing:
                Message.objects.create(
                    conversation=existing,
                    sender=request.user,
                    content=validated['message'],
                )
                existing.save()
                output_serializer = ConversationDetailSerializer(
                    existing, context={'request': request}
                )
                return Response(output_serializer.data, status=status.HTTP_200_OK)

            conversation = Conversation.objects.create(meetup=meetup)
            conversation.participants.add(request.user, meetup.creator)
            Message.objects.create(
                conversation=conversation,
                sender=request.user,
                content=validated['message'],
            )
            output_serializer = ConversationDetailSerializer(
                conversation, context={'request': request}
            )
            return Response(output_serializer.data, status=status.HTTP_201_CREATED)

        listing = Listing.objects.get(pk=listing_id)

        existing = Conversation.objects.filter(
            listing=listing,
            participants=request.user,
        ).filter(participants=listing.seller).first()

        if existing:
            Message.objects.create(
                conversation=existing,
                sender=request.user,
                content=validated['message'],
            )
            existing.save()
            output_serializer = ConversationDetailSerializer(
                existing, context={'request': request}
            )
            return Response(output_serializer.data, status=status.HTTP_200_OK)

        conversation = Conversation.objects.create(listing=listing)
        conversation.participants.add(request.user, listing.seller)
        Message.objects.create(
            conversation=conversation,
            sender=request.user,
            content=validated['message'],
        )
        output_serializer = ConversationDetailSerializer(
            conversation, context={'request': request}
        )
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)


class ConversationDetailView(generics.RetrieveAPIView):
    serializer_class = ConversationDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsParticipant]

    def get_queryset(self):
        return Conversation.objects.filter(
            participants=self.request.user
        ).select_related('listing', 'meetup').prefetch_related('messages', 'messages__sender')


class MessageListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SendMessageSerializer
        return MessageSerializer

    def get_queryset(self):
        conversation = Conversation.objects.get(pk=self.kwargs['pk'])
        return conversation.messages.select_related('sender').all()

    def perform_create(self, serializer):
        conversation = Conversation.objects.get(pk=self.kwargs['pk'])
        serializer.save(sender=self.request.user, conversation=conversation)


class MarkMessagesReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        try:
            conversation = Conversation.objects.get(pk=pk)
        except Conversation.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if request.user not in conversation.participants.all():
            return Response(status=status.HTTP_403_FORBIDDEN)

        conversation.messages.filter(read=False).exclude(
            sender=request.user
        ).update(read=True)
        return Response({'status': 'messages marked as read'})


class UnreadCountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        count = Message.objects.filter(
            conversation__participants=request.user,
            read=False,
        ).exclude(sender=request.user).count()
        return Response({'unread_count': count})