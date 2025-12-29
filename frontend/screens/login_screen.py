from kivy.uix.screenmanager import Screen
from kivy.app import App
from kivy.uix.popup import Popup
from kivy.uix.label import Label
from kivy.properties import ObjectProperty, StringProperty
import requests


class LoginScreen(Screen):
    """Screen for user authentication"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def clear_form(self):
        """Clear login form fields"""
        if hasattr(self.ids, 'username_input'):
            self.ids.username_input.text = ""
        if hasattr(self.ids, 'password_input'):
            self.ids.password_input.text = ""
    
    def login(self):
        """Authenticate user and navigate to home screen"""
        username = getattr(self.ids, 'username_input', type('', (), {'text': ''})).text.strip()
        password = getattr(self.ids, 'password_input', type('', (), {'text': ''})).text.strip()
        
        # Validate input
        if not username:
            self.show_popup("Error", "Username is required")
            return
        if not password:
            self.show_popup("Error", "Password is required")
            return
        
        # Authenticate via API (placeholder - would need actual auth endpoint)
        try:
            # This is a mock authentication - in real app, you'd call your auth API
            if self.authenticate_user(username, password):
                # Store user session (simplified)
                app = App.get_running_app()
                app.user_data = {'username': username, 'logged_in': True}
                
                self.show_popup("Success", "Login successful!")
                # Navigate to home screen after successful login
                self.manager.current = 'home'
            else:
                self.show_popup("Error", "Invalid username or password")
        except Exception as e:
            self.show_popup("Error", f"Login failed: {str(e)}")
    
    def authenticate_user(self, username, password):
        """Mock authentication - replace with actual API call"""
        # This is a simple mock authentication
        # In a real app, you'd make an API call to your Django backend
        valid_credentials = {
            'admin': 'admin123',
            'user': 'password',
            'test': 'test123'
        }
        return valid_credentials.get(username) == password
    
    def forgot_password(self):
        """Handle forgot password functionality"""
        self.show_popup("Info", "Password reset functionality coming soon!")
    
    def navigate_to_signup(self):
        """Navigate to signup screen"""
        self.clear_form()
        self.manager.current = 'signup'
    
    def show_popup(self, title, message):
        """Show a popup message"""
        popup = Popup(
            title=title,
            content=Label(text=message, text_size=(300, None), halign='center'),
            size_hint=(0.8, 0.4),
            auto_dismiss=True
        )
        popup.open()
