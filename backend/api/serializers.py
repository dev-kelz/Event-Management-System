"""
Serializers for Event Manager API.
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Event, Feedback


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class EventSerializer(serializers.ModelSerializer):
    """Serializer for Event model."""
    created_by = UserSerializer(read_only=True)
    duration = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()
    is_past = serializers.ReadOnlyField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'start_date', 'end_date',
            'location', 'created_by', 'created_at', 'updated_at',
            'duration', 'is_upcoming', 'is_past'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'duration', 'is_upcoming', 'is_past']


class FeedbackSerializer(serializers.ModelSerializer):
    """Serializer for Feedback model."""
    user = UserSerializer(read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)

    class Meta:
        model = Feedback
        fields = [
            'id', 'event', 'event_title', 'user', 'rating',
            'comment', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'user']

    def validate(self, data):
        """Check that user hasn't already given feedback for this event."""
        user = self.context['request'].user
        event = data['event']

        if Feedback.objects.filter(user=user, event=event).exists():
            raise serializers.ValidationError("You have already given feedback for this event.")

        return data

