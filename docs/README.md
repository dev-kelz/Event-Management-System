# Event Manager Documentation

Welcome to the Event Manager documentation. This project consists of a desktop frontend application and a web API backend.

## Quick Start

1. **Backend Setup**:
   ```bash
   cd backend
   pip install -r requirements-backend.txt
   python manage.py migrate
   python manage.py runserver
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   pip install -r requirements-frontend.txt
   cd src
   python -m event_manager
   ```

## Documentation Structure

- [`api/`](api/) - API documentation and examples
- [`user-guide/`](user-guide/) - User guides and tutorials
- [`development/`](development/) - Developer documentation

## Architecture Overview

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│  Desktop App    │◄──────────────────►│ Django Backend  │
│   (Toga GUI)    │                     │   (REST API)    │
└─────────────────┘                     └─────────────────┘
         │                                       │
         ▼                                       ▼
┌─────────────────┐                     ┌─────────────────┐
│ Event Manager   │                     │ Event Database  │
│ Frontend        │                     │ (SQLite/PostgreSQL) │
└─────────────────┘                     └─────────────────┘
```

## Key Features

- **Desktop Application**: Cross-platform GUI using Toga framework
- **REST API**: Django-based backend with comprehensive event management
- **Database**: SQLite for development, PostgreSQL for production
- **Authentication**: User-based event management
- **Real-time**: API integration for live data updates

## Getting Help

- Check the [User Guide](user-guide/) for usage instructions
- See [API Documentation](api/) for backend integration
- Review [Development Guide](development/) for contributing
