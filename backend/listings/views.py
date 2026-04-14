from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Category, Listing
from .serializers import (
    CategorySerializer,
    ListingListSerializer,
    ListingDetailSerializer,
    ListingCreateSerializer,
)
from .permissions import IsOwnerOrReadOnly
from .filters import ListingFilter


class ListingListCreateView(generics.ListCreateAPIView):
    parser_classes = [MultiPartParser, FormParser]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']
    filterset_class = ListingFilter

    def get_queryset(self):
        return Listing.objects.select_related('seller', 'category').all()

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ListingCreateSerializer
        return ListingListSerializer

    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)


class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Listing.objects.select_related('seller', 'category').all()

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return ListingCreateSerializer
        return ListingDetailSerializer


class MyListingsView(generics.ListAPIView):
    serializer_class = ListingListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['price', 'created_at']
    ordering = ['-created_at']
    filterset_class = ListingFilter

    def get_queryset(self):
        return Listing.objects.select_related('seller', 'category').filter(
            seller=self.request.user
        )


class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None