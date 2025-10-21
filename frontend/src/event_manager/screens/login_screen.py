"""
Login screen for the Event Manager app.
Allows existing users to log into their account.
"""

import toga
from toga.style.pack import COLUMN, ROW, Pack


class LoginScreen(toga.Box):
    """Screen for user authentication."""

    def __init__(self, on_login=None, on_sign_up=None, *args, **kwargs):
        super().__init__(style=Pack(direction=COLUMN, padding=20), *args, **kwargs)
        self.on_login = on_login
        self.on_sign_up = on_sign_up

        # Title
        self.title = toga.Label(
            "Welcome Back",
            style=Pack(
                padding_top=40,
                padding_bottom=30,
                font_size=24,
                font_weight="bold",
                text_align="center"
            )
        )

        # Username/Email field
        self.username_label = toga.Label(
            "Username or Email:",
            style=Pack(padding_top=10, padding_bottom=5, font_size=14)
        )
        self.username_input = toga.TextInput(
            placeholder="Enter your username or email",
            style=Pack(padding_bottom=15, width=300)
        )

        # Password field
        self.password_label = toga.Label(
            "Password:",
            style=Pack(padding_top=10, padding_bottom=5, font_size=14)
        )
        self.password_input = toga.PasswordInput(
            placeholder="Enter your password",
            style=Pack(padding_bottom=20, width=300)
        )

        # Error message label (hidden by default)
        self.error_label = toga.Label(
            "",
            style=Pack(
                padding=10,
                font_size=12,
                color="#FF0000",
                text_align="center"
            )
        )

        # Login button
        self.login_btn = toga.Button(
            "Log In",
            on_press=self.handle_login,
            style=Pack(
                padding_top=20,
                padding_bottom=10,
                width=200,
                height=45
            )
        )

        # Sign Up link
        self.sign_up_btn = toga.Button(
            "Don't have an account? Sign Up",
            on_press=self.handle_sign_up,
            style=Pack(
                padding_top=10,
                padding_bottom=20,
                width=250,
                height=35
            )
        )

        # Button container for centering
        button_container = toga.Box(
            style=Pack(direction=COLUMN, alignment="center")
        )
        button_container.add(self.login_btn)
        button_container.add(self.sign_up_btn)

        # Add all components to the screen
        self.add(self.title)
        self.add(self.username_label)
        self.add(self.username_input)
        self.add(self.password_label)
        self.add(self.password_input)
        self.add(self.error_label)
        self.add(button_container)

    def validate_inputs(self):
        """Validate all input fields."""
        username = self.username_input.value.strip()
        password = self.password_input.value

        # Check if any field is empty
        if not username:
            return False, "Username or email is required"
        if not password:
            return False, "Password is required"

        return True, None

    def handle_login(self, widget):
        """Handle Login button press."""
        # Validate inputs
        is_valid, error_message = self.validate_inputs()

        if not is_valid:
            self.error_label.text = error_message
            return

        # Clear error message
        self.error_label.text = ""

        # Collect credentials
        credentials = {
            "username": self.username_input.value.strip(),
            "password": self.password_input.value
        }

        # Call the callback if provided
        if self.on_login:
            self.on_login(credentials)

    def handle_sign_up(self, widget):
        """Handle sign up button press."""
        if self.on_sign_up:
            self.on_sign_up()

    def clear_fields(self):
        """Clear all input fields."""
        self.username_input.value = ""
        self.password_input.value = ""
        self.error_label.text = ""
