"""
Event Manager App - Main BeeWare/Toga application entry point.

This is the core application file that initializes and runs the mobile app.
"""

import toga
from toga.style.pack import COLUMN, ROW, Pack
from .services.api_client import APIClient
from .screens.home_screen import HomeScreen
from .screens.getstarted_screen import GetStartedScreen
from .screens.sign_up_screeen import SignUpScreen
from .screens.login_screen import LoginScreen


class EventManagerApp(toga.App):
    """
    Main Event Manager application class.

    This app provides a mobile interface for managing events,
    communicating with a Django REST API backend.
    """

    def __init__(self):
        super().__init__(
            formal_name="Event Manager",
            app_id="com.devkelz.eventmanager"
        )
        # Initialize API client
        self.api_client = APIClient()

    def startup(self):
        """
        Construct and show the Toga application.

        This method is called when the app starts up and creates
        the main user interface.
        """
        # Create the main window with get started screen
        self.main_box = toga.Box(style=Pack(direction=COLUMN))
        self.get_started_screen = GetStartedScreen(on_get_started=self.show_sign_up_screen)
        self.main_box.add(self.get_started_screen)

        self.main_window = toga.MainWindow(title=self.formal_name)
        self.main_window.content = self.main_box
        self.main_window.show()

    def show_sign_up_screen(self):
        """
        Navigate to Sign Up screen.
        """
        # Remove current screen
        if hasattr(self, 'get_started_screen'):
            self.main_box.remove(self.get_started_screen)
        if hasattr(self, 'login_screen'):
            self.main_box.remove(self.login_screen)
        
        # Add sign up screen
        self.sign_up_screen = SignUpScreen(
            on_sign_up=self.handle_sign_up,
            on_back_to_login=self.show_login_screen
        )
        self.main_box.add(self.sign_up_screen)

    def show_login_screen(self):
        """
        Navigate to Login screen.
        """
        # Remove current screen
        if hasattr(self, 'sign_up_screen'):
            self.main_box.remove(self.sign_up_screen)
        if hasattr(self, 'get_started_screen'):
            self.main_box.remove(self.get_started_screen)
        
        # Add login screen
        self.login_screen = LoginScreen(
            on_login=self.handle_login,
            on_sign_up=self.show_sign_up_screen
        )
        self.main_box.add(self.login_screen)

    def show_home_screen(self):
        """
        Navigate to Home screen.
        """
        # Remove current screen
        if hasattr(self, 'login_screen'):
            self.main_box.remove(self.login_screen)
        if hasattr(self, 'sign_up_screen'):
            self.main_box.remove(self.sign_up_screen)
        if hasattr(self, 'create_event_screen'):
            self.main_box.remove(self.create_event_screen)
        if hasattr(self, 'profile_screen'):
            self.main_box.remove(self.profile_screen)
        
        # Add home screen with callbacks
        self.home_screen = HomeScreen(
            on_create_event=self.show_create_event_screen,
            on_view_event=self.show_event_details,
            on_profile=self.show_profile_screen
        )
        self.main_box.add(self.home_screen)

    def show_create_event_screen(self):
        """
        Navigate to Create Event screen.
        """
        # Remove home screen
        if hasattr(self, 'home_screen'):
            self.main_box.remove(self.home_screen)
        
        # TODO: Import and add CreateEventScreen
        print("Navigate to Create Event screen")
        # For now, just go back to home
        # self.show_home_screen()

    def show_event_details(self, event):
        """
        Show event details screen.
        """
        # TODO: Implement event details screen
        print(f"Show details for event: {event['title']}")

    def show_profile_screen(self):
        """
        Navigate to Profile screen.
        """
        # Remove home screen
        if hasattr(self, 'home_screen'):
            self.main_box.remove(self.home_screen)
        
        # TODO: Import and add ProfileScreen
        print("Navigate to Profile screen")
        # For now, just go back to home
        # self.show_home_screen()

    def handle_sign_up(self, user_data):
        """
        Handle user sign up submission.
        """
        # TODO: Call API to register user
        print(f"Sign up attempt: {user_data['username']}, {user_data['email']}")
        # For now, navigate to home screen after successful sign up
        self.show_home_screen()

    def handle_login(self, credentials):
        """
        Handle user login submission.
        """
        # TODO: Call API to authenticate user
        print(f"Login attempt: {credentials['username']}")
        # For now, navigate to home screen after successful login
        self.show_home_screen()


def main():
    """Entry point for the application."""
    return EventManagerApp()
