from django.urls import path
from . import views

urlpatterns = [
    path('', views.ListingListCreateView.as_view(), name='listing-list-create'),
    path('mine/', views.MyListingsView.as_view(), name='my-listings'),
    path('<int:pk>/', views.ListingDetailView.as_view(), name='listing-detail'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),
]