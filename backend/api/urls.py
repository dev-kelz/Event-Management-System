"""
URL patterns for the API app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, FeedbackViewSet, UserViewSet

# Create a router for ViewSets
router = DefaultRouter()
router.register(r'events', EventViewSet)
router.register(r'feedback', FeedbackViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Additional URL patterns can be added here if needed
]
