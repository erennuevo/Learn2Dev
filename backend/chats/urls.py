from django.urls import path
from . import views

urlpatterns = [
    path('', views.ConversationListView.as_view(), name='conversation-list'),
    path('unread/', views.UnreadCountView.as_view(), name='unread-count'),
    path('<int:pk>/', views.ConversationDetailView.as_view(), name='conversation-detail'),
    path('<int:pk>/messages/', views.MessageListCreateView.as_view(), name='message-list-create'),
    path('<int:pk>/messages/read/', views.MarkMessagesReadView.as_view(), name='mark-messages-read'),
]