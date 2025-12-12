import pytest
from kivy.app import App
from frontend.main import EventManagerApp
from frontend.screens.login_screen import LoginScreen
from frontend.screens.event_list_screen import EventListScreen
from frontend.screens.event_detail_screen import EventDetailScreen

class TestKivyApp:
    def test_app_build(self):
        app = EventManagerApp()
        # We can't easily build the KV loop in a headless test without some setup,
        # but we can verify the class exists and can be instantiated.
        assert app is not None

    def test_screens_exist(self):
        login = LoginScreen()
        assert login is not None
        
        event_list = EventListScreen()
        assert event_list is not None
        
        event_detail = EventDetailScreen()
        assert event_detail is not None
