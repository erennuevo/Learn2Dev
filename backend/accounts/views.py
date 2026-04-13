from rest_framework import generics
from rest_framework_simplejwt.views import TokenObtainPairView

from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

from .models import User
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({"message": "CSRF set"})