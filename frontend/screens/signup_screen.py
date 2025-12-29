from kivy.uix.screenmanager import Screen
from kivy.app import App
from kivy.uix.popup import Popup
from kivy.uix.label import Label
import re


class SignUpScreen(Screen):
    """Screen for user registration"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def clear_form(self):
        """Clear signup form fields"""
        if hasattr(self.ids, 'username_input'):
            self.ids.username_input.text = ""
        if hasattr(self.ids, 'email_input'):
            self.ids.email_input.text = ""
        if hasattr(self.ids, 'password_input'):
            self.ids.password_input.text = ""
        if hasattr(self.ids, 'confirm_password_input'):
            self.ids.confirm_password_input.text = ""
        if hasattr(self.ids, 'full_name_input'):
            self.ids.full_name_input.text = ""
    
    def signup(self):
        """Register a new user"""
        username = getattr(self.ids, 'username_input', type('', (), {'text': ''})).text.strip()
        email = getattr(self.ids, 'email_input', type('', (), {'text': ''})).text.strip()
        password = getattr(self.ids, 'password_input', type('', (), {'text': ''})).text.strip()
        confirm_password = getattr(self.ids, 'confirm_password_input', type('', (), {'text': ''})).text.strip()
        full_name = getattr(self.ids, 'full_name_input', type('', (), {'text': ''})).text.strip()
        
        # Validate input
        if not username:
            self.show_popup("Error", "Username is required")
            return
        if not email:
            self.show_popup("Error", "Email is required")
            return
        if not self.validate_email(email):
            self.show_popup("Error", "Please enter a valid email address")
            return
        if not password:
            self.show_popup("Error", "Password is required")
            return
        if len(password) < 6:
            self.show_popup("Error", "Password must be at least 6 characters long")
            return
        if password != confirm_password:
            self.show_popup("Error", "Passwords do not match")
            return
        
        # Register user (mock implementation)
        try:
            if self.register_user(username, email, password, full_name):
                self.show_popup("Success", "Account created successfully! Please login.")
                # Navigate to login screen after successful registration
                self.clear_form()
                self.manager.current = 'login'
            else:
                self.show_popup("Error", "Username or email already exists")
        except Exception as e:
            self.show_popup("Error", f"Registration failed: {str(e)}")
    
    def validate_email(self, email):
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def register_user(self, username, email, password, full_name):
        """Mock user registration - replace with actual API call"""
        # This is a mock registration - in real app, you'd call your registration API
        # For demo purposes, we'll just return True
        # In a real implementation, you'd check if username/email already exists
        # and create the user in your database
        return True
    
    def navigate_to_login(self):
        """Navigate to login screen"""
        self.clear_form()
        self.manager.current = 'login'
    
    def navigate_to_get_started(self):
        """Navigate back to get started screen"""
        self.clear_form()
        self.manager.current = 'get_started'
    
    def show_popup(self, title, message):
        """Show a popup message"""
        popup = Popup(
            title=title,
            content=Label(text=message, text_size=(300, None), halign='center'),
            size_hint=(0.8, 0.4),
            auto_dismiss=True
        )
        popup.open()
