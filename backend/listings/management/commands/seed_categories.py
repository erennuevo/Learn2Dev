from django.core.management.base import BaseCommand
from listings.models import Category


class Command(BaseCommand):
    help = 'Seed the database with default categories'

    def handle(self, *args, **options):
        categories = [
            ('Electronics', 'electronics'),
            ('Books', 'books'),
            ('Tools', 'tools'),
            ('Clothing', 'clothing'),
            ('Sports', 'sports'),
            ('Home', 'home'),
            ('Vehicles', 'vehicles'),
            ('Other', 'other'),
        ]

        created_count = 0
        for name, slug in categories:
            cat, created = Category.objects.get_or_create(
                slug=slug,
                defaults={'name': name},
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(f'Seeded {created_count} new categories ({len(categories)} total)')
        )