"""
Sign Up screen for the Event Manager app.
Allows new users to create an account.
"""

import toga
from toga.style.pack import COLUMN, ROW, Pack


class SignUpScreen(toga.Box):
    """Screen for user registration."""

    def __init__(self, on_sign_up=None, on_back_to_login=None, *args, **kwargs):
        super().__init__(style=Pack(direction=COLUMN, padding=20), *args, **kwargs)
        self.on_sign_up = on_sign_up
        self.on_back_to_login = on_back_to_login
        
        # Title
        self.title = toga.Label(
            "Create Account",
            style=Pack(
                padding_top=20,
                padding_bottom=30,
                font_size=24,
                font_weight="bold",
                text_align="center"
            )
        )

        # Username field
        self.username_label = toga.Label(
            "Username:",
            style=Pack(padding_top=10, padding_bottom=5, font_size=14)
        )
        self.username_input = toga.TextInput(
            placeholder="Enter your username",
            style=Pack(padding_bottom=15, width=300)
        )

        # Email field
        self.email_label = toga.Label(
            "Email:",
            style=Pack(padding_top=10, padding_bottom=5, font_size=14)
        )
        self.email_input = toga.TextInput(
            placeholder="Enter your email",
            style=Pack(padding_bottom=15, width=300)
        )

        # Password field
        self.password_label = toga.Label(
            "Password:",
            style=Pack(padding_top=10, padding_bottom=5, font_size=14)
        )
        self.password_input = toga.PasswordInput(
            placeholder="Enter your password",
            style=Pack(padding_bottom=15, width=300)
        )

        # Confirm Password field
        self.confirm_password_label = toga.Label(
            "Confirm Password:",
            style=Pack(padding_top=10, padding_bottom=5, font_size=14)
        )
        self.confirm_password_input = toga.PasswordInput(
            placeholder="Re-enter your password",
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

        # Sign Up button
        self.sign_up_btn = toga.Button(
            "Sign Up",
            on_press=self.handle_sign_up,
            style=Pack(
                padding_top=20,
                padding_bottom=10,
                width=200,
                height=45
            )
        )

        # Back to Login link
        self.back_to_login_btn = toga.Button(
            "Already have an account? Log In",
            on_press=self.handle_back_to_login,
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
        button_container.add(self.sign_up_btn)
        button_container.add(self.back_to_login_btn)

        # Add all components to the screen
        self.add(self.title)
        self.add(self.username_label)
        self.add(self.username_input)
        self.add(self.email_label)
        self.add(self.email_input)
        self.add(self.password_label)
        self.add(self.password_input)
        self.add(self.confirm_password_label)
        self.add(self.confirm_password_input)
        self.add(self.error_label)
        self.add(button_container)

    def validate_inputs(self):
        """Validate all input fields."""
        username = self.username_input.value.strip()
        email = self.email_input.value.strip()
        password = self.password_input.value
        confirm_password = self.confirm_password_input.value

        # Check if any field is empty
        if not username:
            return False, "Username is required"
        if not email:
            return False, "Email is required"
        if not password:
            return False, "Password is required"
        if not confirm_password:
            return False, "Please confirm your password"

        # Validate username length
        if len(username) < 3:
            return False, "Username must be at least 3 characters"

        # Basic email validation
        if "@" not in email or "." not in email:
            return False, "Please enter a valid email address"

        # Validate password length
        if len(password) < 6:
            return False, "Password must be at least 6 characters"

        # Check if passwords match
        if password != confirm_password:
            return False, "Passwords do not match"

        return True, None

    def handle_sign_up(self, widget):
        """Handle Sign Up button press."""
        # Validate inputs
        is_valid, error_message = self.validate_inputs()

        if not is_valid:
            self.error_label.text = error_message
            return

        # Clear error message
        self.error_label.text = ""

        # Collect user data
        user_data = {
            "username": self.username_input.value.strip(),
            "email": self.email_input.value.strip(),
            "password": self.password_input.value
        }

        # Call the callback if provided
        if self.on_sign_up:
            self.on_sign_up(user_data)

    def handle_back_to_login(self, widget):
        """Handle back to login button press."""
        if self.on_back_to_login:
            self.on_back_to_login()

    def clear_fields(self):
        """Clear all input fields."""
        self.username_input.value = ""
        self.email_input.value = ""
        self.password_input.value = ""
        self.confirm_password_input.value = ""
        self.error_label.text = ""
