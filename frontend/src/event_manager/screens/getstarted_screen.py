"""
Get Started screen for the Event Manager app.
Welcome/onboarding screen displayed when users first launch the app.
"""

import toga
from toga.style.pack import COLUMN, ROW, Pack


class GetStartedScreen(toga.Box):
    """Welcome screen for new users."""

    def __init__(self, on_get_started=None, *args, **kwargs):
        super().__init__(style=Pack(direction=COLUMN), *args, **kwargs)
        self.on_get_started = on_get_started

        # App logo/title
        self.title = toga.Label(
            "Event Manager",
            style=Pack(
                padding_top=40,
                padding_bottom=20,
                padding_left=10,
                padding_right=10,
                font_size=28,
                font_weight="bold",
                text_align="center"
            )
        )

        # Welcome message
        self.welcome_text = toga.Label(
            "Welcome to Event Management System!",
            style=Pack(
                padding=10,
                font_size=20,
                text_align="center"
            )
        )

        # Description
        self.description = toga.Label(
            "Create, manage, and track your events all in one place. "
            "Stay organized and never miss an important event again.",
            style=Pack(
                padding=20,
                font_size=14,
                text_align="center"
            )
        )

        # Features list
        self.features_box = toga.Box(style=Pack(direction=COLUMN, padding=10))
        
        features = [
            "📅 Create and manage events",
            "👥 Track attendees",
            "📍 Set event locations",
            "⏰ Get reminders"
        ]

        for feature in features:
            feature_label = toga.Label(
                feature,
                style=Pack(padding=5, font_size=14)
            )
            self.features_box.add(feature_label)

        # Get Started button
        self.get_started_btn = toga.Button(
            "Get Started",
            on_press=self.handle_get_started,
            style=Pack(
                padding=30,
                width=200,
                height=50
            )
        )

        # Center the button
        button_container = toga.Box(
            style=Pack(direction=ROW, padding=10, alignment="center")
        )
        button_container.add(self.get_started_btn)

        # Add all components to the screen
        self.add(self.title)
        self.add(self.welcome_text)
        self.add(self.description)
        self.add(self.features_box)
        self.add(button_container)

    def handle_get_started(self, widget):
        """Handle Get Started button press."""
        if self.on_get_started:
            self.on_get_started()