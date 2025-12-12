from kivy.uix.screenmanager import Screen
from kivy.properties import ObjectProperty, NumericProperty
from kivy.app import App

class EventDetailScreen(Screen):
    event_id = NumericProperty(None, allownone=True)
    
    def clear_form(self):
        self.event_id = None
        self.ids.title_input.text = ""
        self.ids.description_input.text = ""
        self.ids.location_input.text = ""
        self.ids.start_date_input.text = ""
        self.ids.end_date_input.text = ""

    def load_event(self, event):
        self.event_id = event['id']
        self.ids.title_input.text = event.get('title', '')
        self.ids.description_input.text = event.get('description', '')
        self.ids.location_input.text = event.get('location', '')
        self.ids.start_date_input.text = event.get('start_date', '')
        self.ids.end_date_input.text = event.get('end_date', '')

    def save_event(self):
        data = {
            'title': self.ids.title_input.text,
            'description': self.ids.description_input.text,
            'location': self.ids.location_input.text,
            'start_date': self.ids.start_date_input.text,
            'end_date': self.ids.end_date_input.text,
        }
        
        app = App.get_running_app()
        try:
            if self.event_id:
                app.api_client.update_event(self.event_id, data)
            else:
                app.api_client.create_event(data)
            self.manager.current = 'event_list'
        except Exception as e:
            print(f"Error saving event: {e}")
            # In a real app, show a popup

    def delete_event(self):
        if self.event_id:
            app = App.get_running_app()
            try:
                app.api_client.delete_event(self.event_id)
                self.manager.current = 'event_list'
            except Exception as e:
                print(f"Error deleting event: {e}")

    def cancel(self):
        self.manager.current = 'event_list'
