"""
API views for Event Manager.
"""

from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from .models import Event, Feedback
from .serializers import EventSerializer, FeedbackSerializer, UserSerializer


class EventViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing events.
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        """Set the creator of the event to the current user."""
        serializer.save(created_by=self.request.user)


class FeedbackViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing feedback.
    """
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        """Set the user of the feedback to the current user."""
        serializer.save(user=self.request.user)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

