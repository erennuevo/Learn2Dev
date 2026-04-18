from django.db import models
from django.conf import settings
from listings.models import Listing


class Conversation(models.Model):
    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
        related_name='conversations',
        null=True,
        blank=True,
    )
    meetup = models.ForeignKey(
        'meetups.Meetup',
        on_delete=models.CASCADE,
        related_name='conversations',
        null=True,
        blank=True,
    )
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='conversations',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        participants = ', '.join(u.username for u in self.participants.all())
        if self.listing:
            return f"Conversation about {self.listing.title} ({participants})"
        if self.meetup:
            return f"Conversation about {self.meetup.title} ({participants})"
        return f"Conversation ({participants})"


class Message(models.Model):
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name='messages',
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    content = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{self.sender.username}: {self.content[:50]}"