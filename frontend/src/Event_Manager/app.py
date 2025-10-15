"""
Event Manager Desktop Application

A system to manage events using Toga GUI framework.
"""

import toga
from toga.style.pack import COLUMN, ROW, Pack


class EventManagerApp(toga.App):
    def __init__(self):
        super().__init__(
            formal_name="Event Management System",
            app_id="com.example.eventmanager"
        )

    def startup(self):
        """Construct and show the Toga application."""
        # Create main container with proper Pack styling
        main_box = toga.Box(style=Pack(direction=COLUMN, padding=10))

        # Add a welcome label
        welcome_label = toga.Label(
            "Welcome to Event Manager",
            style=Pack(padding=10, text_align="center")
        )
        
        # Add some buttons for future functionality
        create_event_btn = toga.Button(
            "Create Event",
            on_press=self.create_event,
            style=Pack(padding=5)
        )
        
        view_events_btn = toga.Button(
            "View Events", 
            on_press=self.view_events,
            style=Pack(padding=5)
        )

        # Add widgets to the main box
        main_box.add(welcome_label)
        main_box.add(create_event_btn)
        main_box.add(view_events_btn)

        # Create and show the main window
        self.main_window = toga.MainWindow(title=self.formal_name)
        self.main_window.content = main_box
        self.main_window.show()

    async def create_event(self, widget):
        """Handle create event button press."""
        await self.main_window.info_dialog("Create Event", "Create event functionality coming soon!")

    async def view_events(self, widget):
        """Handle view events button press."""
        await self.main_window.info_dialog("View Events", "View events functionality coming soon!")


def main():
    return EventManagerApp()