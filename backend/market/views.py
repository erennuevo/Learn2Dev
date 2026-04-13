from rest_framework import viewsets, permissions
from .models import Item
from .serializers import ItemSerializer

class ItemViewSet(viewsets.ModelViewSet):
    serializer_class = ItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Item.objects.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)