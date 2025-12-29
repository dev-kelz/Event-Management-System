from kivy.uix.screenmanager import Screen
from kivy.app import App
from kivy.uix.popup import Popup
from kivy.uix.label import Label


class GetStartedScreen(Screen):
    """Welcome/onboarding screen for the application"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def navigate_to_login(self):
        """Navigate to login screen"""
        self.manager.current = 'login'
    
    def navigate_to_signup(self):
        """Navigate to signup screen"""
        self.manager.current = 'signup'
    
    def skip_to_home(self):
        """Skip authentication and go directly to home (for demo purposes)"""
        # Set a default user for demo
        app = App.get_running_app()
        app.user_data = {'username': 'Guest', 'logged_in': True}
        self.manager.current = 'home'
    
    def show_about(self):
        """Show about information"""
        about_text = (
            "Event Management System\n\n"
            "A comprehensive solution for organizing and managing events.\n"
            "Features include:\n"
            "• Event creation and management\n"
            "• User authentication\n"
            "• Task tracking\n"
            "• Notifications\n"
            "• And much more!\n\n"
            "Version 1.0.0"
        )
        self.show_popup("About", about_text)
    
    def show_popup(self, title, message):
        """Show a popup message"""
        popup = Popup(
            title=title,
            content=Label(text=message, text_size=(300, None), halign='center'),
            size_hint=(0.8, 0.6),
            auto_dismiss=True
        )
        popup.open()
