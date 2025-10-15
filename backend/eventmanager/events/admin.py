"""
Admin configuration for Events app.
"""

from django.contrib import admin
from .models import Event


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """Admin interface for Event model."""
    
    list_display = ['title', 'start_date', 'end_date', 'location', 'created_by', 'created_at']
    list_filter = ['start_date', 'location', 'created_by']
    search_fields = ['title', 'description', 'location']
    date_hierarchy = 'start_date'
    ordering = ['-created_at']
    
    fieldsets = (
        ('Event Information', {
            'fields': ('title', 'description', 'location')
        }),
        ('Date & Time', {
            'fields': ('start_date', 'end_date')
        }),
        ('Metadata', {
            'fields': ('created_by',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def save_model(self, request, obj, form, change):
        """Set created_by to current user if not set."""
        if not change:  # Only for new objects
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
