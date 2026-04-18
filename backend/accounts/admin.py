from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Profile


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'profile'


class CustomUserAdmin(UserAdmin):
    inlines = [ProfileInline]


admin.site.register(User, CustomUserAdmin)
admin.site.register(Profile)