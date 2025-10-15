# Development Guide

This guide covers development setup, architecture, and contribution guidelines for the Event Manager project.

## Development Setup

### Prerequisites

- Python 3.8+
- Git
- Virtual environment tool (venv, conda, etc.)

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd event-manager
   ```

2. **Set up backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements-backend.txt
   ```

3. **Initialize database**:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

4. **Run backend server**:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Set up frontend**:
   ```bash
   cd frontend
   pip install -r requirements-frontend.txt
   ```

2. **Run frontend application**:
   ```bash
   cd src
   python -m event_manager
   ```

## Architecture

### Project Structure

```
event-manager/
├── frontend/           # Desktop application (Toga)
├── backend/           # API server (Django)
├── docs/             # Documentation
└── scripts/          # Deployment scripts
```

### Technology Stack

**Frontend:**
- **Toga**: Cross-platform GUI framework
- **Requests**: HTTP client for API communication
- **Python**: Core language

**Backend:**
- **Django**: Web framework
- **Django REST Framework**: API framework
- **SQLite/PostgreSQL**: Database
- **CORS Headers**: Cross-origin support

### Communication Flow

1. **User Interaction**: User interacts with Toga GUI
2. **API Calls**: Frontend makes HTTP requests to Django backend
3. **Data Processing**: Django processes requests and updates database
4. **Response**: Backend returns JSON responses
5. **UI Update**: Frontend updates GUI with new data

## Development Workflow

### Code Style

- **Python**: Follow PEP 8
- **Line Length**: 88 characters (Black default)
- **Imports**: Use isort for import organization
- **Type Hints**: Use type hints where appropriate

### Testing

**Backend Tests:**
```bash
cd backend
pytest
```

**Frontend Tests:**
```bash
cd frontend
pytest
```

### Code Quality

**Formatting:**
```bash
black .
isort .
```

**Linting:**
```bash
flake8
```

**Type Checking:**
```bash
mypy
```

## Contributing

### Git Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/new-feature`
3. **Make** your changes
4. **Test** your changes
5. **Commit** with descriptive messages
6. **Push** to your fork
7. **Create** a pull request

### Pull Request Guidelines

- Include a clear description of changes
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass
- Follow the code style guidelines

### Issue Reporting

When reporting issues:
- Use the issue template
- Include steps to reproduce
- Provide error messages and logs
- Specify your environment (OS, Python version, etc.)

## Deployment

### Backend Deployment

1. **Set environment variables**:
   ```bash
   export DJANGO_ENVIRONMENT=production
   export SECRET_KEY=your-secret-key
   export DB_NAME=eventmanager
   # ... other variables
   ```

2. **Deploy with Gunicorn**:
   ```bash
   gunicorn eventmanager.wsgi:application
   ```

### Frontend Distribution

1. **Build with Briefcase**:
   ```bash
   briefcase build
   briefcase package
   ```

2. **Distribute** the generated packages

## API Development

### Adding New Endpoints

1. **Create models** in the appropriate app
2. **Add serializers** for data validation
3. **Implement views** using ViewSets or APIViews
4. **Register URLs** in the app's urls.py
5. **Add tests** for the new functionality
6. **Update documentation**

### Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## Frontend Development

### Adding New Views

1. **Create view components** in `frontend/src/event_manager/views/`
2. **Implement business logic** in services
3. **Update main app** to include new views
4. **Add tests** for new functionality

### GUI Guidelines

- Use native widgets when possible
- Follow platform-specific design guidelines
- Ensure accessibility
- Test on multiple platforms
