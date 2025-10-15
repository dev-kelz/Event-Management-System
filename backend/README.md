# Event Manager Backend

Django REST API backend for the Event Manager application.

## Features

- RESTful API for event management
- User authentication and authorization
- Event CRUD operations with filtering
- Admin interface for event management
- Comprehensive test suite

## Installation

1. Install dependencies:
```bash
pip install -r requirements-backend.txt
```

2. Set up the database:
```bash
python manage.py migrate
```

3. Create a superuser:
```bash
python manage.py createsuperuser
```

4. Run the development server:
```bash
python manage.py runserver
```

## API Endpoints

### Events
- `GET /api/events/` - List all events
- `POST /api/events/` - Create a new event
- `GET /api/events/{id}/` - Retrieve a specific event
- `PUT /api/events/{id}/` - Update a specific event
- `DELETE /api/events/{id}/` - Delete a specific event
- `GET /api/events/upcoming/` - List upcoming events
- `GET /api/events/past/` - List past events

### Query Parameters
- `start_date` - Filter events by start date
- `end_date` - Filter events by end date
- `location` - Filter events by location (case-insensitive)

## Configuration

### Environment Variables

For production deployment, set these environment variables:

```bash
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DB_NAME=eventmanager
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432
DJANGO_ENVIRONMENT=production
```

### Settings

The project uses a modular settings structure:
- `base.py` - Common settings
- `development.py` - Development-specific settings
- `production.py` - Production-specific settings

## Development

### Running Tests

```bash
pytest
```

### Code Formatting

```bash
black .
isort .
```

### Linting

```bash
flake8
```

### Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## Deployment

1. Set environment variables for production
2. Collect static files: `python manage.py collectstatic`
3. Run migrations: `python manage.py migrate`
4. Use a WSGI server like Gunicorn: `gunicorn eventmanager.wsgi:application`

## Project Structure

```
backend/
├── eventmanager/              # Django project
│   ├── settings/             # Settings modules
│   ├── core/                 # Core app
│   ├── events/               # Events app
│   └── users/                # Users app
├── tests/                    # Test suite
├── manage.py                 # Django management script
└── requirements-backend.txt  # Dependencies
```
