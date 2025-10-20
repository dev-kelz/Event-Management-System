"""
Event detail screen for the Event Manager app.
Shows detailed information about a selected event.
"""

import toga
from toga.style.pack import COLUMN, Pack


class EventDetailScreen(toga.Box):
    """Screen to display event details."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # TODO: Implement event detail UI
        self.label = toga.Label("Event Detail Screen", style=Pack(padding=20))
        self.add(self.label)
