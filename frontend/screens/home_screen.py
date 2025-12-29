from kivy.uix.screenmanager import Screen
from kivy.properties import StringProperty, ListProperty
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.image import AsyncImage
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.clock import Clock
import os


class EventCard(BoxLayout):
    """Custom widget for event category cards"""
    image_source = StringProperty('')
    event_name = StringProperty('')
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)


class UpcomingEventCard(BoxLayout):
    """Custom widget for upcoming event cards"""
    image_source = StringProperty('')
    event_name = StringProperty('')
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def on_see_details(self):
        """Handle see details button click"""
        print(f"See details for: {self.event_name}")


class HomeScreen(Screen):
    """Main home screen of the application"""
    
    username = StringProperty('Destiny')
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Sample data for event categories
        self.event_categories = [
            {'name': 'Turf Ground', 'image': 'turf_ground.png'},
            {'name': 'Wedding Venues', 'image': 'wedding_venue.png'},
            {'name': 'Meeting Venues', 'image': 'meeting_venue.png'},
            {'name': 'Party Hall', 'image': 'party_hall.png'},
        ]
        
        # Sample data for upcoming events
        self.upcoming_events = [
            {'name': 'Tech meeting', 'image': 'tech_meeting.png'},
            {'name': 'FastAPI Webinar', 'image': 'fastapi_webinar.png'},
        ]
    
    def on_enter(self):
        """Called when screen is displayed"""
        # Populate event cards when screen loads
        Clock.schedule_once(self.populate_events, 0.1)
    
    def populate_events(self, dt):
        """Populate event category and upcoming event cards"""
        # This will be called after the KV file is loaded
        pass
    
    def on_search(self, text):
        """Handle search input"""
        print(f"Searching for: {text}")
    
    def on_create_event(self):
        """Navigate to create event screen"""
        print("Create new event clicked")
        # TODO: Navigate to create event screen
        # self.manager.current = 'create_event'
    
    def on_notification_click(self):
        """Handle notification icon click"""
        print("Notifications clicked")
        # Navigate to notifications screen
        self.manager.current = 'notification'
    
    def on_profile_click(self):
        """Handle profile icon click"""
        print("Profile clicked")
        # TODO: Navigate to profile screen
    
    def on_see_all_events(self):
        """Navigate to all events view"""
        print("See all events clicked")
        # TODO: Navigate to events list screen
    
    def on_see_all_upcoming(self):
        """Navigate to all upcoming events view"""
        print("See all upcoming events clicked")
        # TODO: Navigate to upcoming events screen
    
    def on_add_event(self):
        """Handle floating action button click"""
        print("Add event clicked")
        self.on_create_event()
    
    def on_home_tab_click(self):
        """Handle Home tab click in bottom navigation"""
        print("Home tab clicked")
        # Already on home screen, could refresh or scroll to top
        pass
    
    def on_event_tab_click(self):
        """Handle Event tab click in bottom navigation"""
        print("Event tab clicked")
        # Navigate to event list screen
        self.manager.current = 'event_list'
    
    def on_task_tab_click(self):
        """Handle Task tab click in bottom navigation"""
        print("Task tab clicked")
        # Navigate to task list screen
        self.manager.current = 'task_list'
    
    def on_profile_tab_click(self):
        """Handle Profile tab click in bottom navigation"""
        print("Profile tab clicked")
        # TODO: Navigate to profile screen when it's created
        # self.manager.current = 'profile'

