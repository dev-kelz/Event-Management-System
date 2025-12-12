# Kivy Frontend for Event Manager

This is a Kivy-based frontend for the Event Management system.

## prerequisites
- Python 3.8+
- The Django backend must be running.

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Make sure the backend is running:
   ```bash
   cd ../backend
   python manage.py runserver
   ```

3. Run the Kivy app:
   ```bash
   python main.py
   ```

## Structure
- `main.py`: Entry point.
- `kv/`: Kivy language files defining the UI.
- `screens/`: Python classes for each screen.
- `utils/`: Helper utilities (API client).
