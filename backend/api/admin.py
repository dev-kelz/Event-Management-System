"""
Django admin configuration for Event Manager API.
"""

from django.contrib import admin
from .models import Event, Feedback


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """Admin interface for Event model."""

    list_display = ['title', 'start_date', 'end_date', 'location', 'created_by', 'created_at']
    list_filter = ['start_date', 'location', 'created_by']
    search_fields = ['title', 'description', 'location']
    readonly_fields = ['created_at', 'updated_at', 'duration']

    fieldsets = (
        ('Event Information', {
            'fields': ('title', 'description', 'location')
        }),
        ('Date & Time', {
            'fields': ('start_date', 'end_date', 'duration')
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def save_model(self, request, obj, form, change):
        """Automatically set created_by to current user if not set."""
        if not obj.pk and not obj.created_by_id:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    """Admin interface for Feedback model."""

    list_display = ['event', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['event__title', 'user__username', 'comment']
    readonly_fields = ['created_at']

    fieldsets = (
        ('Feedback Information', {
            'fields': ('event', 'user', 'rating', 'comment')
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
