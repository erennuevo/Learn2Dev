from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.parsers import MultiPartParser, FormParser
from django.utils import timezone

from .models import MeetupCategory, Meetup, MeetupRSVP
from .serializers import (
    MeetupCategorySerializer,
    MeetupListSerializer,
    MeetupDetailSerializer,
    MeetupCreateSerializer,
    MeetupRSVPSerializer,
)
from .permissions import IsCreatorOrReadOnly
from .filters import MeetupFilter


def auto_complete_past_meetups():
    """Mark upcoming/ongoing meetups whose datetime has passed as completed."""
    Meetup.objects.filter(
        meetup_datetime__lt=timezone.now(),
        status__in=['upcoming', 'ongoing'],
    ).update(status='completed')


class MeetupListCreateView(generics.ListCreateAPIView):
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['meetup_datetime', 'created_at']
    ordering = ['meetup_datetime']
    filterset_class = MeetupFilter

    def get_queryset(self):
        auto_complete_past_meetups()
        return Meetup.objects.select_related('creator', 'creator__profile', 'category').all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MeetupCreateSerializer
        return MeetupListSerializer

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class MeetupDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsCreatorOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        auto_complete_past_meetups()
        return Meetup.objects.select_related(
            'creator', 'creator__profile', 'category'
        ).prefetch_related('rsvps', 'rsvps__user', 'rsvps__user__profile')

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return MeetupCreateSerializer
        return MeetupDetailSerializer


class MyMeetupsView(generics.ListAPIView):
    serializer_class = MeetupListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['meetup_datetime', 'created_at']
    ordering = ['meetup_datetime']
    filterset_class = MeetupFilter

    def get_queryset(self):
        auto_complete_past_meetups()
        return Meetup.objects.select_related(
            'creator', 'creator__profile', 'category'
        ).filter(creator=self.request.user)


class MeetupCategoryListView(generics.ListAPIView):
    queryset = MeetupCategory.objects.all()
    serializer_class = MeetupCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


class RSVPCreateUpdateView(generics.CreateAPIView):
    serializer_class = MeetupRSVPSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        meetup_id = kwargs['pk']
        try:
            meetup = Meetup.objects.get(pk=meetup_id)
        except Meetup.DoesNotExist:
            return Response(
                {'detail': 'Meetup not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        rsvp_status = request.data.get('status', 'going')

        if meetup.max_attendees:
            current_count = meetup.rsvps.filter(status='going').count()
            if current_count >= meetup.max_attendees and rsvp_status == 'going':
                return Response(
                    {'detail': 'This meetup is full.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        rsvp, created = MeetupRSVP.objects.update_or_create(
            meetup_id=meetup_id,
            user=request.user,
            defaults={'status': rsvp_status},
        )
        serializer = MeetupRSVPSerializer(rsvp)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RSVPDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MeetupRSVP.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        try:
            rsvp = self.get_queryset().get(meetup_id=kwargs['pk'])
            rsvp.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except MeetupRSVP.DoesNotExist:
            return Response(
                {'detail': 'RSVP not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )