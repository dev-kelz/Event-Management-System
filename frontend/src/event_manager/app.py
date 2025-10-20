"""
Event Manager App - Main BeeWare/Toga application entry point.

This is the core application file that initializes and runs the mobile app.
"""

import toga
from toga.style.pack import COLUMN, ROW, Pack
from .services.api_client import APIClient
from .screens.home_screen import HomeScreen
from .screens.getstarted_screen import GetStartedScreen


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
        self.get_started_screen = GetStartedScreen(on_get_started=self.show_home_screen)
        self.main_box.add(self.get_started_screen)

        self.main_window = toga.MainWindow(title=self.formal_name)
        self.main_window.content = self.main_box
        self.main_window.show()

    def show_home_screen(self):
        """
        Navigate from Get Started screen to Home screen.
        """
        # Remove get started screen
        self.main_box.remove(self.get_started_screen)
        
        # Add home screen
        self.home_screen = HomeScreen()
        self.main_box.add(self.home_screen)


def main():
    """Entry point for the application."""
    return EventManagerApp()
