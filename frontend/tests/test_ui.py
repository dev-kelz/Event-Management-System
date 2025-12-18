import sys
import os
import pytest

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from kivy.app import App
from frontend.main import EventManagerApp
from frontend.screens.login_screen import LoginScreen
from frontend.screens.event_list_screen import EventListScreen
from frontend.screens.event_detail_screen import EventDetailScreen
from frontend.screens.get_started_screen import GetStartedScreen
from frontend.screens.signup_screen import SignUpScreen

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

        get_started = GetStartedScreen()
        assert get_started is not None

        signup = SignUpScreen()
        assert signup is not None
