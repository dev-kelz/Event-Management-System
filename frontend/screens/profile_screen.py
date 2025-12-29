from kivy.uix.screenmanager import Screen
from kivy.properties import StringProperty, DictProperty
from kivy.app import App
from kivy.uix.popup import Popup
from kivy.uix.label import Label
from kivy.clock import Clock


class ProfileScreen(Screen):
    """Screen for user profile management"""
    
    user_data = DictProperty({})
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def on_enter(self):
        """Called when screen is displayed"""
        self.load_user_profile()
    
    def load_user_profile(self):
        """Load user profile data"""
        app = App.get_running_app()
        if hasattr(app, 'user_data'):
            self.user_data = app.user_data.copy()
        else:
            # Default user data for demo
            self.user_data = {
                'username': 'demo_user',
                'full_name': 'Demo User',
                'email': 'demo@example.com',
                'phone': '+1234567890',
                'bio': 'Event management enthusiast',
                'joined_date': '2024-01-01',
                'events_created': 12,
                'tasks_completed': 45
            }
    
    def update_profile(self):
        """Update user profile with form data"""
        # Get form data
        full_name = getattr(self.ids, 'full_name_input', type('', (), {'text': ''})).text.strip()
        email = getattr(self.ids, 'email_input', type('', (), {'text': ''})).text.strip()
        phone = getattr(self.ids, 'phone_input', type('', (), {'text': ''})).text.strip()
        bio = getattr(self.ids, 'bio_input', type('', (), {'text': ''})).text.strip()
        
        # Validate email
        if email and not self.validate_email(email):
            self.show_popup("Error", "Please enter a valid email address")
            return
        
        # Update user data
        self.user_data.update({
            'full_name': full_name,
            'email': email,
            'phone': phone,
            'bio': bio
        })
        
        # Save to app (mock implementation)
        app = App.get_running_app()
        app.user_data.update(self.user_data)
        
        self.show_popup("Success", "Profile updated successfully!")
    
    def validate_email(self, email):
        """Validate email format"""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    def change_password(self):
        """Handle password change"""
        current_password = getattr(self.ids, 'current_password_input', type('', (), {'text': ''})).text.strip()
        new_password = getattr(self.ids, 'new_password_input', type('', (), {'text': ''})).text.strip()
        confirm_password = getattr(self.ids, 'confirm_password_input', type('', (), {'text': ''})).text.strip()
        
        if not current_password or not new_password or not confirm_password:
            self.show_popup("Error", "All password fields are required")
            return
        
        if len(new_password) < 6:
            self.show_popup("Error", "New password must be at least 6 characters long")
            return
        
        if new_password != confirm_password:
            self.show_popup("Error", "New passwords do not match")
            return
        
        # Mock password change (in real app, would call API)
        self.show_popup("Success", "Password changed successfully!")
        
        # Clear password fields
        if hasattr(self.ids, 'current_password_input'):
            self.ids.current_password_input.text = ""
        if hasattr(self.ids, 'new_password_input'):
            self.ids.new_password_input.text = ""
        if hasattr(self.ids, 'confirm_password_input'):
            self.ids.confirm_password_input.text = ""
    
    def logout(self):
        """Logout user and navigate to login screen"""
        app = App.get_running_app()
        app.user_data = {'logged_in': False}
        
        self.show_popup("Success", "Logged out successfully!")
        # Navigate to login screen after a short delay
        Clock.schedule_once(lambda dt: self.navigate_to_login(), 1.5)
    
    def navigate_to_login(self):
        """Navigate to login screen"""
        self.manager.current = 'login'
    
    def navigate_back(self):
        """Navigate back to home screen"""
        self.manager.current = 'home'
    
    def view_settings(self):
        """Navigate to settings screen"""
        self.show_popup("Info", "Settings screen coming soon!")
    
    def view_help(self):
        """Show help information"""
        help_text = (
            "Profile Help\n\n"
            "• Edit your personal information\n"
            "• Change your password\n"
            "• View your activity statistics\n"
            "• Manage your account settings\n\n"
            "For additional support, contact the administrator."
        )
        self.show_popup("Help", help_text)
    
    def show_popup(self, title, message):
        """Show a popup message"""
        popup = Popup(
            title=title,
            content=Label(text=message, text_size=(300, None), halign='center'),
            size_hint=(0.8, 0.4),
            auto_dismiss=True
        )
        popup.open()