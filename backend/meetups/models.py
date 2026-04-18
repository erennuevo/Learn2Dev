from django.db import models
from django.conf import settings


class MeetupCategory(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, blank=True, default='')
    color = models.CharField(max_length=7, blank=True, default='#4F46E5')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'meetup categories'


class Meetup(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    location_text = models.CharField(max_length=200, blank=True, default='')
    latitude = models.DecimalField(max_digits=11, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    meetup_datetime = models.DateTimeField()
    category = models.ForeignKey(
        MeetupCategory,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='meetups',
    )
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_meetups',
    )
    max_attendees = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='upcoming')
    image = models.ImageField(upload_to='meetups/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        indexes = [
            models.Index(fields=['latitude', 'longitude']),
        ]


class MeetupRSVP(models.Model):
    STATUS_CHOICES = [
        ('going', 'Going'),
        ('maybe', 'Maybe'),
        ('not_going', 'Not Going'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='meetup_rsvps',
    )
    meetup = models.ForeignKey(
        Meetup,
        on_delete=models.CASCADE,
        related_name='rsvps',
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='going')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'meetup')

    def __str__(self):
        return f"{self.user.username} - {self.meetup.title} ({self.status})"