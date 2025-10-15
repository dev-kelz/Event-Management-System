# Event Manager

A comprehensive event management system with a desktop GUI frontend and REST API backend.

## 🚀 Features

- **Desktop Application**: Cross-platform GUI using Toga framework
- **REST API Backend**: Django-based API for event management
- **Event Management**: Create, read, update, and delete events
- **User Authentication**: Secure user-based event management
- **Real-time Updates**: Live synchronization between frontend and backend
- **Cross-platform**: Works on Windows, macOS, and Linux

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│  Desktop App    │◄──────────────────►│ Django Backend  │
│   (Toga GUI)    │                     │   (REST API)    │
└─────────────────┘                     └─────────────────┘
```

## 📁 Project Structure

```
event-manager/
├── frontend/                   # Desktop application
│   ├── src/event_manager/     # Main application package
│   ├── tests/                 # Frontend tests
│   └── requirements-frontend.txt
├── backend/                   # API server
│   ├── eventmanager/         # Django project
│   ├── tests/                # Backend tests
│   └── requirements-backend.txt
├── docs/                     # Documentation
├── scripts/                  # Deployment scripts
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- pip (Python package manager)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements-backend.txt
   ```

3. **Set up database**:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser  # Optional: create admin user
   ```

4. **Start the backend server**:
   ```bash
   python manage.py runserver
   ```

   The API will be available at `http://localhost:8000/api/`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements-frontend.txt
   ```

3. **Run the desktop application**:
   ```bash
   cd src
   python -m event_manager
   ```

## 📖 Documentation

- **[User Guide](docs/user-guide/)** - How to use the application
- **[API Documentation](docs/api/)** - REST API reference
- **[Development Guide](docs/development/)** - Setup and contribution guidelines

## 🛠️ Development

### Automated Setup

Use the setup script for quick development environment setup:

```bash
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh
```

### Manual Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd event-manager
   ```

2. **Set up virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install all dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Follow the Quick Start steps above**

### Running Tests

**Backend tests**:
```bash
cd backend
pytest
```

**Frontend tests**:
```bash
cd frontend
pytest
```

### Code Quality

**Format code**:
```bash
black .
isort .
```

**Lint code**:
```bash
flake8
```

## 🚀 Deployment

### Backend Deployment

1. Set environment variables for production
2. Use a production WSGI server like Gunicorn:
   ```bash
   gunicorn eventmanager.wsgi:application
   ```

### Frontend Distribution

Build distributable packages using Briefcase:
```bash
briefcase build
briefcase package
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Dev Kelz**
- Email: kelz.codes@gmail.com
- GitHub: [@Dev-Kelz](https://github.com/Dev-Kelz)

## 🙏 Acknowledgments

- Built with [Toga](https://toga.readthedocs.io/) for cross-platform GUI
- Powered by [Django](https://www.djangoproject.com/) and [Django REST Framework](https://www.django-rest-framework.org/)
- Part of [The BeeWare Project](https://beeware.org/)
