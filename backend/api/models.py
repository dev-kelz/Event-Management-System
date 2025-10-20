"""
Database models for Event Manager API.
"""

from django.db import models
from django.contrib.auth.models import User


class Event(models.Model):
    """
    Event model for storing event information.

    Attributes:
        title: Event title/name
        description: Detailed description of the event
        start_date: When the event starts
        end_date: When the event ends
        location: Where the event takes place
        created_by: User who created the event
        created_at: Timestamp when event was created
        updated_at: Timestamp when event was last updated
    """

    title = models.CharField(max_length=200, help_text="Event title")
    description = models.TextField(blank=True, help_text="Event description")
    start_date = models.DateTimeField(help_text="Event start date and time")
    end_date = models.DateTimeField(help_text="Event end date and time")
    location = models.CharField(max_length=200, blank=True, help_text="Event location")
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='created_events',
        help_text="User who created this event"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_date']
        verbose_name = 'Event'
        verbose_name_plural = 'Events'
        indexes = [
            models.Index(fields=['start_date']),
            models.Index(fields=['created_by']),
        ]

    def __str__(self):
        return f"{self.title} - {self.start_date.strftime('%Y-%m-%d %H:%M')}"

    @property
    def duration(self):
        """Calculate event duration in hours."""
        delta = self.end_date - self.start_date
        return delta.total_seconds() / 3600

    @property
    def is_upcoming(self):
        """Check if event is in the future."""
        from django.utils import timezone
        return self.start_date > timezone.now()

    @property
    def is_past(self):
        """Check if event has ended."""
        from django.utils import timezone
        return self.end_date < timezone.now()


class Feedback(models.Model):
    """
    Feedback model for events.

    Attributes:
        event: The event this feedback is for
        user: The user who gave the feedback
        rating: Rating from 1 to 5
        comment: Optional comment
        created_at: When the feedback was given
    """

    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='feedback',
        help_text="Event this feedback is for"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='event_feedback',
        help_text="User who gave the feedback"
    )
    rating = models.IntegerField(
        choices=[(i, i) for i in range(1, 6)],
        help_text="Rating from 1 to 5"
    )
    comment = models.TextField(blank=True, help_text="Optional comment")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['event', 'user']  # One feedback per user per event
        ordering = ['-created_at']

    def __str__(self):
        return f"Feedback for {self.event.title} by {self.user.username}"
