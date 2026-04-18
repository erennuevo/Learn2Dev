from django.urls import path
from . import views

urlpatterns = [
    path('', views.MeetupListCreateView.as_view(), name='meetup-list-create'),
    path('mine/', views.MyMeetupsView.as_view(), name='my-meetups'),
    path('categories/', views.MeetupCategoryListView.as_view(), name='meetup-category-list'),
    path('<int:pk>/', views.MeetupDetailView.as_view(), name='meetup-detail'),
    path('<int:pk>/rsvp/', views.RSVPCreateUpdateView.as_view(), name='meetup-rsvp'),
    path('<int:pk>/rsvp/delete/', views.RSVPDeleteView.as_view(), name='meetup-rsvp-delete'),
]