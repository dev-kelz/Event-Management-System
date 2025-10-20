"""
Home screen for the Event Manager app.
Displays list of events and navigation options.
"""

import toga
from toga.style.pack import COLUMN, Pack


class HomeScreen(toga.Box):
    """Main home screen displaying events."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # TODO: Implement home screen UI
        self.label = toga.Label("Home Screen - Events List", style=Pack(padding=20))
        self.add(self.label)
