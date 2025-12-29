from kivy.uix.screenmanager import Screen
from kivy.app import App
from kivy.uix.popup import Popup
from kivy.uix.label import Label
from kivy.clock import Clock


class CreateEventScreen(Screen):
    """Screen for creating new events"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def clear_form(self):
        """Clear all form fields"""
        if hasattr(self.ids, 'title_input'):
            self.ids.title_input.text = ""
        if hasattr(self.ids, 'description_input'):
            self.ids.description_input.text = ""
        if hasattr(self.ids, 'location_input'):
            self.ids.location_input.text = ""
        if hasattr(self.ids, 'start_date_input'):
            self.ids.start_date_input.text = ""
        if hasattr(self.ids, 'end_date_input'):
            self.ids.end_date_input.text = ""
        if hasattr(self.ids, 'category_input'):
            self.ids.category_input.text = ""
    
    def create_event(self):
        """Create a new event with form data"""
        # Get form data
        title = getattr(self.ids, 'title_input', type('', (), {'text': ''})).text.strip()
        description = getattr(self.ids, 'description_input', type('', (), {'text': ''})).text.strip()
        location = getattr(self.ids, 'location_input', type('', (), {'text': ''})).text.strip()
        start_date = getattr(self.ids, 'start_date_input', type('', (), {'text': ''})).text.strip()
        end_date = getattr(self.ids, 'end_date_input', type('', (), {'text': ''})).text.strip()
        category = getattr(self.ids, 'category_input', type('', (), {'text': ''})).text.strip()
        
        # Validate required fields
        if not title:
            self.show_popup("Error", "Title is required")
            return
        if not start_date:
            self.show_popup("Error", "Start date is required")
            return
        if not end_date:
            self.show_popup("Error", "End date is required")
            return
        
        # Prepare event data
        event_data = {
            'title': title,
            'description': description,
            'location': location,
            'start_date': start_date,
            'end_date': end_date,
            'category': category or 'General'
        }
        
        # Create event via API
        app = App.get_running_app()
        try:
            app.api_client.create_event(event_data)
            self.show_popup("Success", "Event created successfully!")
            # Clear form and navigate back after a short delay
            Clock.schedule_once(lambda dt: self.navigate_back(), 1.5)
        except Exception as e:
            self.show_popup("Error", f"Failed to create event: {str(e)}")
    
    def navigate_back(self):
        """Navigate back to event list screen"""
        self.clear_form()
        self.manager.current = 'event_list'
    
    def cancel(self):
        """Cancel event creation and navigate back"""
        self.clear_form()
        self.manager.current = 'event_list'
    
    def show_popup(self, title, message):
        """Show a popup message"""
        popup = Popup(
            title=title,
            content=Label(text=message, text_size=(300, None), halign='center'),
            size_hint=(0.8, 0.4),
            auto_dismiss=True
        )
        popup.open()