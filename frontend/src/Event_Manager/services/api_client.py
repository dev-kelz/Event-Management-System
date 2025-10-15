"""
API Client for Event Manager Backend

Handles all communication with the Django REST API backend.
"""

import requests
from typing import List, Dict, Optional
import json


class EventAPIClient:
    """Client for communicating with the Event Manager API."""
    
    def __init__(self, base_url: str = "http://localhost:8000/api"):
        self.base_url = base_url
        self.session = requests.Session()
        
    def get_events(self) -> List[Dict]:
        """Fetch all events from the API."""
        try:
            response = self.session.get(f"{self.base_url}/events/")
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching events: {e}")
            return []
    
    def create_event(self, event_data: Dict) -> Optional[Dict]:
        """Create a new event."""
        try:
            response = self.session.post(
                f"{self.base_url}/events/",
                json=event_data,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error creating event: {e}")
            return None
    
    def update_event(self, event_id: int, event_data: Dict) -> Optional[Dict]:
        """Update an existing event."""
        try:
            response = self.session.put(
                f"{self.base_url}/events/{event_id}/",
                json=event_data,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error updating event: {e}")
            return None
    
    def delete_event(self, event_id: int) -> bool:
        """Delete an event."""
        try:
            response = self.session.delete(f"{self.base_url}/events/{event_id}/")
            response.raise_for_status()
            return True
        except requests.RequestException as e:
            print(f"Error deleting event: {e}")
            return False
