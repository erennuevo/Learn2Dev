from django.core.management.base import BaseCommand
from meetups.models import MeetupCategory


class Command(BaseCommand):
    help = 'Seed the database with default meetup categories'

    def handle(self, *args, **options):
        categories = [
            ('Study Group', 'study-group', 'book', '#3B82F6'),
            ('Social Hangout', 'social-hangout', 'users', '#8B5CF6'),
            ('Sports & Fitness', 'sports-fitness', 'trophy', '#10B981'),
            ('Food & Coffee', 'food-coffee', 'coffee', '#F59E0B'),
            ('Gaming', 'gaming', 'gamepad', '#EF4444'),
            ('Tech & Coding', 'tech-coding', 'code', '#6366F1'),
            ('Outdoor Adventure', 'outdoor-adventure', 'mountain', '#059669'),
            ('Music & Jam Session', 'music-jam', 'music', '#EC4899'),
            ('Workshop & Learn', 'workshop-learn', 'graduation-cap', '#0EA5E9'),
            ('Other', 'other', 'calendar', '#6B7280'),
        ]

        created_count = 0
        for name, slug, icon, color in categories:
            cat, created = MeetupCategory.objects.get_or_create(
                slug=slug,
                defaults={'name': name, 'icon': icon, 'color': color},
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(f'Seeded {created_count} new meetup categories ({len(categories)} total)')
        )