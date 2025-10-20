"""
Create event screen for the Event Manager app.
Allows users to create new events.
"""

import toga
from toga.style.pack import COLUMN, Pack


class CreateEventScreen(toga.Box):
    """Screen for creating new events."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # TODO: Implement create event form
        self.label = toga.Label("Create Event Screen", style=Pack(padding=20))
        self.add(self.label)
