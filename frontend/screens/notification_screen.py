from kivy.uix.screenmanager import Screen
from kivy.properties import ListProperty, StringProperty
from kivy.app import App
from kivy.uix.popup import Popup
from kivy.uix.label import Label
from kivy.clock import Clock
from datetime import datetime, timedelta


class NotificationScreen(Screen):
    """Screen for displaying user notifications"""
    
    notifications = ListProperty([])
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.load_sample_notifications()
    
    def on_enter(self):
        """Called when screen is displayed"""
        self.refresh_notifications()
    
    def load_sample_notifications(self):
        """Load sample notifications for demo purposes"""
        self.notifications = [
            {
                'id': 1,
                'title': 'New Event Created',
                'message': 'Your event "Tech Meeting" has been created successfully.',
                'type': 'success',
                'timestamp': datetime.now() - timedelta(hours=2),
                'read': False
            },
            {
                'id': 2,
                'title': 'Event Reminder',
                'message': 'Don\'t forget about the FastAPI Webinar tomorrow at 3 PM.',
                'type': 'reminder',
                'timestamp': datetime.now() - timedelta(days=1),
                'read': False
            },
            {
                'id': 3,
                'title': 'Event Updated',
                'message': 'The venue for "Team Building" has been changed.',
                'type': 'info',
                'timestamp': datetime.now() - timedelta(days=2),
                'read': True
            },
            {
                'id': 4,
                'title': 'Task Assigned',
                'message': 'You have been assigned a new task: "Prepare presentation".',
                'type': 'task',
                'timestamp': datetime.now() - timedelta(days=3),
                'read': True
            },
            {
                'id': 5,
                'title': 'System Update',
                'message': 'New features have been added to the event management system.',
                'type': 'system',
                'timestamp': datetime.now() - timedelta(days=5),
                'read': True
            }
        ]
    
    def refresh_notifications(self):
        """Refresh notifications list"""
        # In a real app, this would fetch from API
        # For now, we'll just reload sample data
        self.load_sample_notifications()
    
    def mark_as_read(self, notification_id):
        """Mark a notification as read"""
        for notification in self.notifications:
            if notification['id'] == notification_id:
                notification['read'] = True
                break
    
    def mark_all_as_read(self):
        """Mark all notifications as read"""
        for notification in self.notifications:
            notification['read'] = True
        self.show_popup("Success", "All notifications marked as read")
    
    def delete_notification(self, notification_id):
        """Delete a notification"""
        self.notifications = [n for n in self.notifications if n['id'] != notification_id]
    
    def clear_all_notifications(self):
        """Clear all notifications"""
        self.notifications = []
        self.show_popup("Success", "All notifications cleared")
    
    def get_notification_icon(self, notification_type):
        """Get icon based on notification type"""
        icons = {
            'success': '✓',
            'reminder': '⏰',
            'info': 'ℹ',
            'task': '📋',
            'system': '⚙',
            'warning': '⚠',
            'error': '✗'
        }
        return icons.get(notification_type, '📢')
    
    def format_timestamp(self, timestamp):
        """Format timestamp for display"""
        now = datetime.now()
        diff = now - timestamp
        
        if diff.days == 0:
            if diff.seconds < 3600:
                minutes = diff.seconds // 60
                return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
            else:
                hours = diff.seconds // 3600
                return f"{hours} hour{'s' if hours != 1 else ''} ago"
        elif diff.days == 1:
            return "Yesterday"
        elif diff.days < 7:
            return f"{diff.days} day{'s' if diff.days != 1 else ''} ago"
        else:
            return timestamp.strftime("%b %d, %Y")
    
    def get_unread_count(self):
        """Get count of unread notifications"""
        return len([n for n in self.notifications if not n['read']])
    
    def navigate_back(self):
        """Navigate back to previous screen"""
        self.manager.current = 'home'
    
    def show_popup(self, title, message):
        """Show a popup message"""
        popup = Popup(
            title=title,
            content=Label(text=message, text_size=(300, None), halign='center'),
            size_hint=(0.8, 0.4),
            auto_dismiss=True
        )
        popup.open()