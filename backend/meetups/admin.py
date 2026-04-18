from django.contrib import admin
from .models import MeetupCategory, Meetup, MeetupRSVP


admin.site.register(MeetupCategory)
admin.site.register(Meetup)
admin.site.register(MeetupRSVP)