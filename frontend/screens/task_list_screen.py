from kivy.uix.screenmanager import Screen
from kivy.properties import ListProperty, StringProperty
from kivy.app import App
from kivy.uix.popup import Popup
from kivy.uix.label import Label
from kivy.clock import Clock
from datetime import datetime, timedelta


class TaskListScreen(Screen):
    """Screen for displaying and managing tasks"""
    
    tasks = ListProperty([])
    filter_status = StringProperty('all')  # all, pending, in_progress, completed
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.load_sample_tasks()
    
    def on_enter(self):
        """Called when screen is displayed"""
        self.refresh_tasks()
    
    def load_sample_tasks(self):
        """Load sample tasks for demo purposes"""
        self.tasks = [
            {
                'id': 1,
                'title': 'Prepare presentation slides',
                'description': 'Create slides for the upcoming tech meeting',
                'status': 'in_progress',
                'priority': 'high',
                'due_date': datetime.now() + timedelta(days=1),
                'event_id': 1,
                'event_name': 'Tech Meeting',
                'created_at': datetime.now() - timedelta(days=3),
                'assigned_to': 'demo_user'
            },
            {
                'id': 2,
                'title': 'Book venue for team building',
                'description': 'Contact venues and get quotes for team building event',
                'status': 'pending',
                'priority': 'medium',
                'due_date': datetime.now() + timedelta(days=5),
                'event_id': 2,
                'event_name': 'Team Building',
                'created_at': datetime.now() - timedelta(days=2),
                'assigned_to': 'demo_user'
            },
            {
                'id': 3,
                'title': 'Send event invitations',
                'description': 'Email invitations to all participants for FastAPI webinar',
                'status': 'completed',
                'priority': 'high',
                'due_date': datetime.now() - timedelta(days=1),
                'event_id': 3,
                'event_name': 'FastAPI Webinar',
                'created_at': datetime.now() - timedelta(days=5),
                'assigned_to': 'demo_user'
            },
            {
                'id': 4,
                'title': 'Arrange catering',
                'description': 'Order food and drinks for the meeting',
                'status': 'pending',
                'priority': 'low',
                'due_date': datetime.now() + timedelta(days=3),
                'event_id': 1,
                'event_name': 'Tech Meeting',
                'created_at': datetime.now() - timedelta(days=1),
                'assigned_to': 'demo_user'
            },
            {
                'id': 5,
                'title': 'Test presentation equipment',
                'description': 'Ensure projector and microphone are working',
                'status': 'in_progress',
                'priority': 'medium',
                'due_date': datetime.now() + timedelta(hours=6),
                'event_id': 1,
                'event_name': 'Tech Meeting',
                'created_at': datetime.now() - timedelta(hours=12),
                'assigned_to': 'demo_user'
            }
        ]
    
    def refresh_tasks(self):
        """Refresh tasks list"""
        # In a real app, this would fetch from API
        # For now, we'll just reload sample data
        self.load_sample_tasks()
    
    def get_filtered_tasks(self):
        """Get tasks based on current filter"""
        if self.filter_status == 'all':
            return self.tasks
        return [task for task in self.tasks if task['status'] == self.filter_status]
    
    def filter_tasks(self, status):
        """Filter tasks by status"""
        self.filter_status = status
    
    def mark_task_completed(self, task_id):
        """Mark a task as completed"""
        for task in self.tasks:
            if task['id'] == task_id:
                task['status'] = 'completed'
                self.show_popup("Success", f"Task '{task['title']}' marked as completed")
                break
    
    def mark_task_in_progress(self, task_id):
        """Mark a task as in progress"""
        for task in self.tasks:
            if task['id'] == task_id:
                task['status'] = 'in_progress'
                self.show_popup("Success", f"Task '{task['title']}' marked as in progress")
                break
    
    def delete_task(self, task_id):
        """Delete a task"""
        task = next((t for t in self.tasks if t['id'] == task_id), None)
        if task:
            self.tasks = [t for t in self.tasks if t['id'] != task_id]
            self.show_popup("Success", f"Task '{task['title']}' deleted")
    
    def get_priority_color(self, priority):
        """Get color based on task priority"""
        colors = {
            'high': '#FF5252',    # Red
            'medium': '#FFC107',  # Amber
            'low': '#4CAF50'      # Green
        }
        return colors.get(priority, '#757575')  # Gray as default
    
    def get_status_color(self, status):
        """Get color based on task status"""
        colors = {
            'pending': '#9E9E9E',      # Gray
            'in_progress': '#2196F3',  # Blue
            'completed': '#4CAF50'     # Green
        }
        return colors.get(status, '#757575')  # Gray as default
    
    def format_due_date(self, due_date):
        """Format due date for display"""
        now = datetime.now()
        diff = due_date - now
        
        if diff.days < 0:
            return f"Overdue ({abs(diff.days)} day{'s' if abs(diff.days) != 1 else ''})"
        elif diff.days == 0:
            if diff.seconds < 3600:
                minutes = diff.seconds // 60
                return f"Due in {minutes} minute{'s' if minutes != 1 else ''}"
            else:
                hours = diff.seconds // 3600
                return f"Due in {hours} hour{'s' if hours != 1 else ''}"
        elif diff.days == 1:
            return "Due tomorrow"
        elif diff.days < 7:
            return f"Due in {diff.days} day{'s' if diff.days != 1 else ''}"
        else:
            return due_date.strftime("%b %d, %Y")
    
    def get_task_stats(self):
        """Get task statistics"""
        total = len(self.tasks)
        pending = len([t for t in self.tasks if t['status'] == 'pending'])
        in_progress = len([t for t in self.tasks if t['status'] == 'in_progress'])
        completed = len([t for t in self.tasks if t['status'] == 'completed'])
        
        return {
            'total': total,
            'pending': pending,
            'in_progress': in_progress,
            'completed': completed
        }
    
    def navigate_to_task_management(self):
        """Navigate to task management screen"""
        self.manager.current = 'task_management'
    
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