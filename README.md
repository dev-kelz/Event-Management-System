# 📱 Event Manager

> **A Full-Stack Event Management System**
>
> Mobile app built with Kivy + Django REST API backend

![Python](https://img.shields.io/badge/Python-3.8+-blue)
![Django](https://img.shields.io/badge/Django-4.2+-green)
![Kivy](https://img.shields.io/badge/Kivy-2.0+-orange)

## 🎯 Project Overview

Event Manager is a comprehensive event management system consisting of:

- **Backend**: Django REST API with SQLite/PostgreSQL
- **Frontend**: Kivy cross-platform mobile app (iOS, Android, Desktop)

Perfect for learning modern full-stack development!

## 🏗️ Project Structure

```
Event-Manager/
│
├── backend/                         # Django backend
│   ├── event_manager/              # Main Django project
│   │   ├── __init__.py
│   │   ├── settings.py             # Config: SQLite (dev) + PostgreSQL (prod)
│   │   ├── urls.py                 # URL routing
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   ├── api/                        # API app for Kivy
│   │   ├── __init__.py
│   │   ├── models.py               # Database models (Events, Users)
│   │   ├── views.py                # API logic
│   │   ├── serializers.py          # Django REST Framework serializers
│   │   ├── urls.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   └── tests.py
│   │
│   ├── manage.py                   # Django CLI entry point
│   ├── db.sqlite3                  # Dev database (auto-created)
│   └── requirements.txt            # Backend dependencies
│
├── frontend/                       # Kivy frontend app
│   ├── kv/                         # Kivy UI layout files
│   ├── screens/                    # Screen logic
│   ├── utils/                      # Helper utilities
│   ├── tests/                      # Tests
│   ├── main.py                     # App entry point
│   └── requirements.txt            # Frontend dependencies
│
├── docs/                           # Documentation, reports, diagrams
│   ├── README.md
│   ├── database_schema.md
│   ├── architecture_diagram.png    # (Add your diagram here)
│   └── database_schema.png         # (Add your diagram here)
│
├── scripts/                        # Helper scripts
│   ├── setup_dev.sh                # Development setup
│   └── deploy_prod.sh              # Production deployment
│
├── .gitignore
└── README.md                       # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- pip

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend will be available at: `http://localhost:8000/api/`

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
pip install -r requirements.txt

# Run app
python main.py
```

## 🔧 Development

### Backend Development

```bash
cd backend

# Run tests
pytest

# Make migrations
python manage.py makemigrations
python manage.py migrate

# Access admin panel
# Go to http://localhost:8000/admin/
```

### Frontend Development

```bash
cd frontend

# Run in development mode
python main.py

# Run tests
pytest
```

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/events/` | GET | List all events |
| `/api/events/` | POST | Create new event |
| `/api/events/{id}/` | GET | Get specific event |
| `/api/events/{id}/` | PUT | Update event |
| `/api/events/{id}/` | DELETE | Delete event |
| `/api/events/upcoming/` | GET | List upcoming events |
| `/api/events/past/` | GET | List past events |
| `/api/events/today/` | GET | Events happening today |

### Example API Request

```bash
# Create event
curl -X POST http://localhost:8000/api/events/ \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Team Meeting",
    "description": "Weekly sync",
    "start_date": "2025-10-20T14:00:00Z",
    "end_date": "2025-10-20T15:00:00Z",
    "location": "Room A"
  }'
```

## 🛠️ Technology Stack

### Backend
- **Framework**: Django 4.2+
- **API**: Django REST Framework
- **Database**: SQLite (dev), PostgreSQL (prod)
- **CORS**: django-cors-headers

### Frontend
- **Framework**: Kivy
- **Language**: Python 3.8+
- **HTTP Client**: requests
- **UI Definition**: KV Language

## 📚 Documentation

- [Backend API Docs](backend/README.md)
- [Frontend App Docs](frontend/README.md)
- [Database Schema](docs/database_schema.md)
- [Full Documentation](docs/README.md)

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
pytest
```

## 📦 Deployment

### Backend (Production)

```bash
# Set environment variables
export DB_NAME=event_manager
export DB_USER=postgres
export DB_PASSWORD=your_password
export DB_HOST=localhost
export DB_PORT=5432

# Run deployment script
./scripts/deploy_prod.sh

# Start with Gunicorn
gunicorn event_manager.wsgi:application
```

### Frontend (App Stores)

Use [Buildozer](https://buildozer.readthedocs.io/en/latest/) to package Kivy applications for Android and iOS.

```bash
# Example Buildozer commands (requires buildozer.spec)
buildozer init
buildozer -v android debug
```

## 🎓 For School Projects

This project demonstrates:
- ✅ Full-stack development (Frontend + Backend)
- ✅ RESTful API design
- ✅ Database design and modeling
- ✅ Cross-platform mobile development
- ✅ Modern Python development practices
- ✅ Version control with Git
- ✅ Documentation and testing

### Key Features to Highlight

1. **Architecture**: Clean separation between frontend and backend
2. **API Design**: RESTful principles with proper HTTP methods
3. **Database**: Proper schema design with relationships
4. **Mobile Development**: Cross-platform using Python
5. **Testing**: Unit tests for both frontend and backend
6. **Documentation**: Comprehensive project documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

MIT License

## 👨‍💻 Author

**Dev Kelz**
- Email: kelz.codes@gmail.com
- GitHub: [@Dev-Kelz](https://github.com/Dev-Kelz)

## 🙏 Acknowledgments

- Built with [Django](https://www.djangoproject.com/)
- Frontend powered by [Kivy](https://kivy.org/)

---

**Ready to get started?** Run `./scripts/setup_dev.sh` to set up your development environment!

