"""
Main entry point for the Event Manager application.
"""

from event_manager.app import main

if __name__ == '__main__':
    app = main()
    app.main_loop()
