from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    ProfileView,
    PublicProfileView,
    csrf,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('csrf/', csrf, name='csrf'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/<str:username>/', PublicProfileView.as_view(), name='public-profile'),
]