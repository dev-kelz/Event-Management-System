"""
Tests for the main application module.
"""

import unittest
from unittest.mock import patch
from Event_Manager.app import EventManagerApp


class TestEventManagerApp(unittest.TestCase):
    """Test cases for EventManagerApp."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.app = EventManagerApp()
    
    def test_app_initialization(self):
        """Test that the app initializes correctly."""
        self.assertEqual(self.app.formal_name, "Event Management System")
        self.assertEqual(self.app.app_id, "com.example.eventmanager")
    
    @patch('toga.MainWindow')
    @patch('toga.Box')
    @patch('toga.Label')
    @patch('toga.Button')
    def test_startup(self, mock_button, mock_label, mock_box, mock_window):
        """Test the startup method."""
        self.app.startup()
        
        # Verify that GUI components are created
        mock_box.assert_called()
        mock_label.assert_called()
        mock_button.assert_called()
        mock_window.assert_called()


if __name__ == '__main__':
    unittest.main()