"""
Tests for Event Manager API.
"""

from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Event


class EventModelTest(TestCase):
    """Test Event model."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.event = Event.objects.create(
            title='Test Event',
            description='Test Description',
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=1, hours=2),
            location='Test Location',
            created_by=self.user
        )
    
    def test_event_creation(self):
        """Test that event is created correctly."""
        self.assertEqual(self.event.title, 'Test Event')
        self.assertEqual(self.event.created_by, self.user)
    
    def test_event_str(self):
        """Test event string representation."""
        self.assertIn('Test Event', str(self.event))
    
    def test_event_duration(self):
        """Test duration calculation."""
        self.assertEqual(self.event.duration, 2.0)
    
    def test_is_upcoming(self):
        """Test is_upcoming property."""
        self.assertTrue(self.event.is_upcoming)
    
    def test_is_past(self):
        """Test is_past property."""
        self.assertFalse(self.event.is_past)


class EventAPITest(APITestCase):
    """Test Event API endpoints."""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        self.event_data = {
            'title': 'API Test Event',
            'description': 'Test via API',
            'start_date': (timezone.now() + timedelta(days=1)).isoformat(),
            'end_date': (timezone.now() + timedelta(days=1, hours=2)).isoformat(),
            'location': 'API Test Location'
        }
    
    def test_create_event(self):
        """Test creating event via API."""
        response = self.client.post('/api/events/', self.event_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Event.objects.count(), 1)
        self.assertEqual(Event.objects.get().title, 'API Test Event')
    
    def test_list_events(self):
        """Test listing events."""
        Event.objects.create(
            title='Event 1',
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=1, hours=1),
            created_by=self.user
        )
        response = self.client.get('/api/events/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_upcoming_events(self):
        """Test upcoming events endpoint."""
        Event.objects.create(
            title='Future Event',
            start_date=timezone.now() + timedelta(days=1),
            end_date=timezone.now() + timedelta(days=1, hours=1),
            created_by=self.user
        )
        response = self.client.get('/api/events/upcoming/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data), 0)

