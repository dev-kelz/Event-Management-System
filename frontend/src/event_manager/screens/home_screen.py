"""
Home screen for the Event Manager app.
Displays list of events and navigation options.
"""

import toga
from toga.style.pack import COLUMN, ROW, Pack


class HomeScreen(toga.Box):
    """Main home screen displaying events."""

    def __init__(self, on_create_event=None, on_view_event=None, on_profile=None, *args, **kwargs):
        super().__init__(style=Pack(direction=COLUMN), *args, **kwargs)
        self.on_create_event = on_create_event
        self.on_view_event = on_view_event
        self.on_profile = on_profile
        self.events = []  # Will hold event data

        # Header with title and profile button
        self.header = self._create_header()
        self.add(self.header)

        # Welcome section
        self.welcome_box = toga.Box(style=Pack(direction=COLUMN, padding=20))
        self.welcome_label = toga.Label(
            "My Events",
            style=Pack(
                padding_bottom=10,
                font_size=22,
                font_weight="bold"
            )
        )
        self.welcome_box.add(self.welcome_label)
        self.add(self.welcome_box)

        # Search/Filter section
        self.search_box = toga.Box(style=Pack(direction=ROW, padding=(0, 20, 10, 20)))
        self.search_input = toga.TextInput(
            placeholder="Search events...",
            style=Pack(flex=1, padding_right=10)
        )
        self.search_btn = toga.Button(
            "Search",
            on_press=self.handle_search,
            style=Pack(width=80)
        )
        self.search_box.add(self.search_input)
        self.search_box.add(self.search_btn)
        self.add(self.search_box)

        # Events list container
        self.events_container = toga.Box(
            style=Pack(direction=COLUMN, padding=(10, 20), flex=1)
        )
        self.events_scroll = toga.ScrollContainer(
            content=self.events_container,
            style=Pack(flex=1)
        )
        self.add(self.events_scroll)

        # Create Event button (floating action button style)
        self.create_event_btn = toga.Button(
            "➕ Create New Event",
            on_press=self.handle_create_event,
            style=Pack(
                padding=20,
                width=250,
                height=50,
                font_size=14
            )
        )
        create_btn_container = toga.Box(
            style=Pack(direction=ROW, padding=10, alignment="center")
        )
        create_btn_container.add(self.create_event_btn)
        self.add(create_btn_container)

        # Load initial events
        self.load_events()

    def _create_header(self):
        """Create the header with app title and profile button."""
        header_box = toga.Box(
            style=Pack(
                direction=ROW,
                padding=15,
                background_color="#4A90E2"
            )
        )

        # App title
        title_label = toga.Label(
            "Event Manager",
            style=Pack(
                flex=1,
                padding_left=10,
                font_size=18,
                font_weight="bold",
                color="#FFFFFF"
            )
        )

        # Profile button
        profile_btn = toga.Button(
            "👤 Profile",
            on_press=self.handle_profile,
            style=Pack(width=100, height=35)
        )

        header_box.add(title_label)
        header_box.add(profile_btn)

        return header_box

    def load_events(self):
        """Load and display events."""
        # Clear existing events
        for child in list(self.events_container.children):
            self.events_container.remove(child)

        # Sample events (replace with API call)
        self.events = [
            {
                "id": 1,
                "title": "Team Meeting",
                "date": "2024-10-25",
                "time": "10:00 AM",
                "location": "Conference Room A",
                "attendees": 8
            },
            {
                "id": 2,
                "title": "Project Launch",
                "date": "2024-10-28",
                "time": "2:00 PM",
                "location": "Main Hall",
                "attendees": 50
            },
            {
                "id": 3,
                "title": "Training Session",
                "date": "2024-11-01",
                "time": "9:00 AM",
                "location": "Training Room",
                "attendees": 15
            }
        ]

        # Display message if no events
        if not self.events:
            no_events_label = toga.Label(
                "No events found. Create your first event!",
                style=Pack(
                    padding=20,
                    font_size=14,
                    text_align="center",
                    color="#888888"
                )
            )
            self.events_container.add(no_events_label)
        else:
            # Display each event as a card
            for event in self.events:
                event_card = self._create_event_card(event)
                self.events_container.add(event_card)

    def _create_event_card(self, event):
        """Create a card widget for an event."""
        # Card container
        card = toga.Box(
            style=Pack(
                direction=COLUMN,
                padding=15,
                background_color="#F5F5F5"
            )
        )

        # Event title
        title_label = toga.Label(
            event["title"],
            style=Pack(
                padding_bottom=8,
                font_size=16,
                font_weight="bold"
            )
        )

        # Event details
        date_label = toga.Label(
            f"📅 {event['date']} at {event['time']}",
            style=Pack(padding_bottom=5, font_size=12)
        )

        location_label = toga.Label(
            f"📍 {event['location']}",
            style=Pack(padding_bottom=5, font_size=12)
        )

        attendees_label = toga.Label(
            f"👥 {event['attendees']} attendees",
            style=Pack(padding_bottom=10, font_size=12)
        )

        # Action buttons
        button_box = toga.Box(style=Pack(direction=ROW, padding_top=5))
        
        view_btn = toga.Button(
            "View Details",
            on_press=lambda widget, e=event: self.handle_view_event(e),
            style=Pack(width=120, height=35, padding_right=10)
        )

        edit_btn = toga.Button(
            "Edit",
            on_press=lambda widget, e=event: self.handle_edit_event(e),
            style=Pack(width=80, height=35, padding_right=10)
        )

        delete_btn = toga.Button(
            "Delete",
            on_press=lambda widget, e=event: self.handle_delete_event(e),
            style=Pack(width=80, height=35)
        )

        button_box.add(view_btn)
        button_box.add(edit_btn)
        button_box.add(delete_btn)

        # Add all elements to card
        card.add(title_label)
        card.add(date_label)
        card.add(location_label)
        card.add(attendees_label)
        card.add(button_box)

        # Add spacing between cards
        spacer = toga.Box(style=Pack(height=10))
        
        container = toga.Box(style=Pack(direction=COLUMN))
        container.add(card)
        container.add(spacer)

        return container

    def handle_create_event(self, widget):
        """Handle create event button press."""
        if self.on_create_event:
            self.on_create_event()

    def handle_view_event(self, event):
        """Handle view event details."""
        if self.on_view_event:
            self.on_view_event(event)

    def handle_edit_event(self, event):
        """Handle edit event."""
        # TODO: Implement edit functionality
        print(f"Edit event: {event['title']}")

    def handle_delete_event(self, event):
        """Handle delete event."""
        # TODO: Implement delete functionality with confirmation
        print(f"Delete event: {event['title']}")
        # Remove from list and reload
        self.events = [e for e in self.events if e['id'] != event['id']]
        self.load_events()

    def handle_search(self, widget):
        """Handle search functionality."""
        search_term = self.search_input.value.lower().strip()
        if not search_term:
            self.load_events()
            return

        # Filter events by search term
        filtered_events = [
            e for e in self.events
            if search_term in e['title'].lower() or
               search_term in e['location'].lower()
        ]

        # Clear and display filtered results
        for child in list(self.events_container.children):
            self.events_container.remove(child)

        if not filtered_events:
            no_results_label = toga.Label(
                f"No events found for '{search_term}'",
                style=Pack(
                    padding=20,
                    font_size=14,
                    text_align="center",
                    color="#888888"
                )
            )
            self.events_container.add(no_results_label)
        else:
            for event in filtered_events:
                event_card = self._create_event_card(event)
                self.events_container.add(event_card)

    def handle_profile(self, widget):
        """Handle profile button press."""
        if self.on_profile:
            self.on_profile()

    def refresh_events(self):
        """Refresh the events list (call after creating/editing events)."""
        # TODO: Fetch events from API
        self.load_events()
