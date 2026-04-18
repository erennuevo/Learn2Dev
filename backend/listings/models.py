from django.db import models
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, blank=True, default='')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'categories'


class Listing(models.Model):
    LISTING_TYPES = [
        ('sell', 'For Sale'),
        ('borrow', 'For Borrow'),
    ]
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('sold', 'Sold'),
        ('borrowed', 'Borrowed'),
        ('returned', 'Returned'),
    ]
    CONDITION_CHOICES = [
        ('new', 'New'),
        ('like_new', 'Like New'),
        ('good', 'Good'),
        ('fair', 'Fair'),
    ]

    seller = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='listings',
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    listing_type = models.CharField(max_length=10, choices=LISTING_TYPES)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='listings',
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, blank=True, default='')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='available')
    image = models.ImageField(upload_to='listings/', blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title