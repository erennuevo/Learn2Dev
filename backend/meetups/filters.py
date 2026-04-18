import django_filters
from django.db import models
from .models import Meetup


class MeetupFilter(django_filters.FilterSet):
    min_lat = django_filters.NumberFilter(field_name='latitude', lookup_expr='gte')
    max_lat = django_filters.NumberFilter(field_name='latitude', lookup_expr='lte')
    min_lng = django_filters.NumberFilter(field_name='longitude', lookup_expr='gte')
    max_lng = django_filters.NumberFilter(field_name='longitude', lookup_expr='lte')
    date_from = django_filters.DateTimeFilter(field_name='meetup_datetime', lookup_expr='gte')
    date_to = django_filters.DateTimeFilter(field_name='meetup_datetime', lookup_expr='lte')
    search = django_filters.CharFilter(method='filter_search')

    class Meta:
        model = Meetup
        fields = ['category', 'status', 'creator']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            models.Q(title__icontains=value) | models.Q(description__icontains=value)
        )