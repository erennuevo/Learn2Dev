from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, CustomTokenObtainPairView, csrf

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('login/', CustomTokenObtainPairView.as_view()),
    path("csrf/", csrf),
]