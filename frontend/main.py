import os
import sys

# Add the current directory to path so we can import modules easily
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from kivy.app import App
from kivy.lang import Builder
from kivy.uix.screenmanager import ScreenManager

from utils.api_client import APIClient
from screens.get_started_screen import GetStartedScreen
from screens.signup_screen import SignUpScreen
from screens.login_screen import LoginScreen
from screens.home_screen import HomeScreen
from screens.event_list_screen import EventListScreen
from screens.event_detail_screen import EventDetailScreen
from screens.create_event_screen import CreateEventScreen
from screens.notification_screen import NotificationScreen
from screens.profile_screen import ProfileScreen
from screens.task_list_screen import TaskListScreen
from screens.task_management_screen import TaskManagementScreen



class EventManagerApp(App):
    def build(self):
        self.api_client = APIClient()
        # Load the main KV file. 
        # Note: 'kv/main.kv' path depends on where main.py is run from. 
        # Assuming run from frontend/
        return Builder.load_file('kv/main.kv')

if __name__ == '__main__':
    EventManagerApp().run()
