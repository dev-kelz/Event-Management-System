from kivy.uix.screenmanager import Screen
from kivy.properties import NumericProperty, ListProperty
from kivy.app import App
from kivy.uix.popup import Popup
from kivy.uix.label import Label
from kivy.clock import Clock
from datetime import datetime, timedelta


class TaskManagementScreen(Screen):
    """Screen for creating and editing tasks"""
    
    task_id = NumericProperty(None, allownone=True)
    events = ListProperty([])
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.load_sample_events()
    
    def load_sample_events(self):
        """Load sample events for task assignment"""
        self.events = [
            {'id': 1, 'title': 'Tech Meeting'},
            {'id': 2, 'title': 'Team Building'},
            {'id': 3, 'title': 'FastAPI Webinar'},
            {'id': 4, 'title': 'Product Launch'},
            {'id': 5, 'title': 'Quarterly Review'}
        ]
    
    def on_enter(self):
        """Called when screen is displayed"""
        if not self.task_id:
            self.clear_form()
    
    def clear_form(self):
        """Clear all form fields"""
        self.task_id = None
        if hasattr(self.ids, 'title_input'):
            self.ids.title_input.text = ""
        if hasattr(self.ids, 'description_input'):
            self.ids.description_input.text = ""
        if hasattr(self.ids, 'priority_spinner'):
            self.ids.priority_spinner.text = "Medium"
        if hasattr(self.ids, 'status_spinner'):
            self.ids.status_spinner.text = "Pending"
        if hasattr(self.ids, 'due_date_input'):
            self.ids.due_date_input.text = ""
        if hasattr(self.ids, 'event_spinner'):
            self.ids.event_spinner.text = "Select Event"
        if hasattr(self.ids, 'assigned_to_input'):
            self.ids.assigned_to_input.text = ""
    
    def load_task(self, task):
        """Load task data into form for editing"""
        self.task_id = task['id']
        if hasattr(self.ids, 'title_input'):
            self.ids.title_input.text = task.get('title', '')
        if hasattr(self.ids, 'description_input'):
            self.ids.description_input.text = task.get('description', '')
        if hasattr(self.ids, 'priority_spinner'):
            self.ids.priority_spinner.text = task.get('priority', 'Medium')
        if hasattr(self.ids, 'status_spinner'):
            self.ids.status_spinner.text = task.get('status', 'Pending')
        if hasattr(self.ids, 'due_date_input'):
            due_date = task.get('due_date')
            if due_date:
                if isinstance(due_date, datetime):
                    self.ids.due_date_input.text = due_date.strftime("%Y-%m-%d %H:%M")
                else:
                    self.ids.due_date_input.text = str(due_date)
        if hasattr(self.ids, 'event_spinner'):
            event_name = task.get('event_name', 'Select Event')
            self.ids.event_spinner.text = event_name
        if hasattr(self.ids, 'assigned_to_input'):
            self.ids.assigned_to_input.text = task.get('assigned_to', '')
    
    def save_task(self):
        """Save task (create new or update existing)"""
        # Get form data
        title = getattr(self.ids, 'title_input', type('', (), {'text': ''})).text.strip()
        description = getattr(self.ids, 'description_input', type('', (), {'text': ''})).text.strip()
        priority = getattr(self.ids, 'priority_spinner', type('', (), {'text': 'Medium'})).text
        status = getattr(self.ids, 'status_spinner', type('', (), {'text': 'Pending'})).text
        due_date_str = getattr(self.ids, 'due_date_input', type('', (), {'text': ''})).text.strip()
        event_name = getattr(self.ids, 'event_spinner', type('', (), {'text': 'Select Event'})).text
        assigned_to = getattr(self.ids, 'assigned_to_input', type('', (), {'text': ''})).text.strip()
        
        # Validate required fields
        if not title:
            self.show_popup("Error", "Task title is required")
            return
        if not due_date_str:
            self.show_popup("Error", "Due date is required")
            return
        
        # Parse due date
        try:
            due_date = datetime.strptime(due_date_str, "%Y-%m-%d %H:%M")
        except ValueError:
            try:
                due_date = datetime.strptime(due_date_str, "%Y-%m-%d")
            except ValueError:
                self.show_popup("Error", "Invalid date format. Use YYYY-MM-DD or YYYY-MM-DD HH:MM")
                return
        
        # Find event ID
        event_id = None
        if event_name != "Select Event":
            event = next((e for e in self.events if e['title'] == event_name), None)
            if event:
                event_id = event['id']
        
        # Prepare task data
        task_data = {
            'title': title,
            'description': description,
            'priority': priority.lower(),
            'status': status.lower().replace(' ', '_'),
            'due_date': due_date,
            'event_id': event_id,
            'event_name': event_name if event_name != "Select Event" else None,
            'assigned_to': assigned_to or 'demo_user',
            'created_at': datetime.now()
        }
        
        # Save task (mock implementation)
        try:
            if self.task_id:
                task_data['id'] = self.task_id
                self.show_popup("Success", "Task updated successfully!")
            else:
                task_data['id'] = len(self.get_existing_tasks()) + 1
                self.show_popup("Success", "Task created successfully!")
            
            # Navigate back to task list after a short delay
            Clock.schedule_once(lambda dt: self.navigate_back(), 1.5)
        except Exception as e:
            self.show_popup("Error", f"Failed to save task: {str(e)}")
    
    def get_existing_tasks(self):
        """Get existing tasks from task list screen (mock implementation)"""
        # In a real app, this would fetch from API or database
        # For now, return empty list
        return []
    
    def delete_task(self):
        """Delete current task"""
        if not self.task_id:
            self.show_popup("Error", "No task selected for deletion")
            return
        
        # Confirm deletion
        self.show_popup("Confirm", "Task deleted successfully!")
        # Navigate back after a short delay
        Clock.schedule_once(lambda dt: self.navigate_back(), 1.5)
    
    def cancel(self):
        """Cancel task creation/editing and navigate back"""
        self.clear_form()
        self.manager.current = 'task_list'
    
    def navigate_back(self):
        """Navigate back to task list screen"""
        self.clear_form()
        self.manager.current = 'task_list'
    
    def set_due_date_today(self):
        """Set due date to today"""
        today = datetime.now().strftime("%Y-%m-%d %H:%M")
        if hasattr(self.ids, 'due_date_input'):
            self.ids.due_date_input.text = today
    
    def set_due_date_tomorrow(self):
        """Set due date to tomorrow"""
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d %H:%M")
        if hasattr(self.ids, 'due_date_input'):
            self.ids.due_date_input.text = tomorrow
    
    def set_due_date_next_week(self):
        """Set due date to next week"""
        next_week = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d %H:%M")
        if hasattr(self.ids, 'due_date_input'):
            self.ids.due_date_input.text = next_week
    
    def get_priority_color(self, priority):
        """Get color based on task priority"""
        colors = {
            'high': '#FF5252',    # Red
            'medium': '#FFC107',  # Amber
            'low': '#4CAF50'      # Green
        }
        return colors.get(priority.lower(), '#757575')  # Gray as default
    
    def show_popup(self, title, message):
        """Show a popup message"""
        popup = Popup(
            title=title,
            content=Label(text=message, text_size=(300, None), halign='center'),
            size_hint=(0.8, 0.4),
            auto_dismiss=True
        )
        popup.open()