"""
Profile screen for the Event Manager app.
Shows user profile and settings.
"""

import toga
from toga.style.pack import COLUMN, Pack


class ProfileScreen(toga.Box):
    """Screen for user profile management."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # TODO: Implement profile UI
        self.label = toga.Label("Profile Screen", style=Pack(padding=20))
        self.add(self.label)
