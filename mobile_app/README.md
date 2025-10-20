# Event Manager App - BeeWare/Toga Mobile Application

Cross-platform mobile application for managing events, built with Toga (BeeWare).

## Features

- 📱 **Native Mobile Apps**: iOS and Android
- 💻 **Desktop Support**: Windows, macOS, Linux
- 🔌 **API Integration**: Connects to Django REST backend
- 🎨 **Native UI**: Platform-native widgets

## Quick Start

### Development Mode (Desktop Testing)

```bash
cd src
python -m event_manager_app.app
```

### Build for Mobile

#### Android
```bash
briefcase create android
briefcase build android
briefcase run android
```

#### iOS (macOS only)
```bash
briefcase create iOS
briefcase build iOS
briefcase run iOS
```

## Project Structure

```
event_manager_app/
├── src/
│   ├── event_manager_app/
│   │   ├── __init__.py
│   │   ├── app.py              # Main BeeWare app entry
│   │   ├── main_window.py      # UI code
│   │   ├── api_client.py       # Django REST API client
│   │   └── utils.py            # Helper functions
│   └── tests/
│       └── test_ui.py
├── build/                      # Build outputs
├── pyproject.toml              # BeeWare/Briefcase config
└── README.md
```

## Configuration

Edit API endpoint in `api_client.py`:
```python
APIClient(base_url="http://your-server:8000/api")
```

## Requirements

- Python 3.8+
- BeeWare/Briefcase
- Django backend running

## Development

```bash
# Run tests
pytest

# Build for all platforms
briefcase package android
briefcase package iOS
```

## License

MIT License

