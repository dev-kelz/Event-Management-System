"""
API Client for Event Manager mobile app.
Handles communication with Django REST API backend.
"""

import requests
from typing import List, Dict, Any


class APIClient:
    """Client for interacting with the Event Manager API."""

    def __init__(self, base_url: str = "http://127.0.0.1:8000/api"):
        self.base_url = base_url

    def get_events(self, **params) -> List[Dict[str, Any]]:
        """Fetch list of events with optional filters."""
        response = requests.get(f"{self.base_url}/events/", params=params)
        response.raise_for_status()
        return response.json()

    def get_event(self, event_id: int) -> Dict[str, Any]:
        """Fetch a single event by ID."""
        response = requests.get(f"{self.base_url}/events/{event_id}/")
        response.raise_for_status()
        return response.json()

    def create_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new event."""
        response = requests.post(f"{self.base_url}/events/", json=event_data)
        response.raise_for_status()
        return response.json()

    def update_event(self, event_id: int, event_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update an existing event."""
        response = requests.put(f"{self.base_url}/events/{event_id}/", json=event_data)
        response.raise_for_status()
        return response.json()

    def delete_event(self, event_id: int):
        """Delete an event."""
        response = requests.delete(f"{self.base_url}/events/{event_id}/")
        response.raise_for_status()
