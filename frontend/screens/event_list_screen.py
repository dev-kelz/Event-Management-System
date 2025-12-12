from kivy.uix.screenmanager import Screen
from kivy.properties import ListProperty
from kivy.app import App
from kivy.clock import Clock

class EventListScreen(Screen):
    events = ListProperty([])

    def on_enter(self):
        self.fetch_events()

    def fetch_events(self):
        app = App.get_running_app()
        try:
            # Running in a separate thread would be better to avoid freezing UI
            # but for simplicity we call directly for now, or use Clock.schedule_once
            # if the api_client was async (it's not).
            # In a real app, use threading or async requests.
            self.events = app.api_client.get_events()
        except Exception as e:
            print(f"Error fetching events: {e}")
            self.events = []

    def refresh(self):
        self.fetch_events()

    def add_event(self):
        self.manager.current = 'event_detail'
        self.manager.get_screen('event_detail').clear_form()

    def view_event(self, event_id):
        # Find event data
        event = next((e for e in self.events if e['id'] == event_id), None)
        if event:
            self.manager.current = 'event_detail'
            self.manager.get_screen('event_detail').load_event(event)
