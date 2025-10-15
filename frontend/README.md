# Event Manager Frontend

Desktop GUI application for managing events, built with the Toga framework.

## Features

- Cross-platform desktop application (Windows, macOS, Linux)
- Modern GUI interface using native widgets
- Event creation and management
- Integration with Event Manager API backend

## Installation

1. Install dependencies:
```bash
pip install -r requirements-frontend.txt
```

2. Run the application:
```bash
cd src
python -m event_manager
```

## Development

### Setup Development Environment

1. Install development dependencies:
```bash
pip install -r requirements-frontend.txt
pip install -e .[dev]
```

2. Run tests:
```bash
pytest
```

3. Code formatting:
```bash
black src/
```

4. Type checking:
```bash
mypy src/
```

## Project Structure

```
frontend/
├── src/
│   └── event_manager/          # Main application package
│       ├── app.py             # Main application class
│       ├── views/             # GUI components
│       ├── services/          # API clients
│       ├── models/            # Data models
│       └── utils/             # Utilities
├── tests/                     # Test suite
├── requirements-frontend.txt  # Dependencies
└── pyproject.toml            # Project configuration
```

## Configuration

The application connects to the backend API at `http://localhost:8000/api` by default. This can be configured in `utils/constants.py`.

## Building

To build a distributable application:

```bash
briefcase build
```

## Contributing

1. Follow PEP 8 style guidelines
2. Add tests for new features
3. Update documentation as needed
