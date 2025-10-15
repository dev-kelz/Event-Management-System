# Event Manager Setup Guide

This guide will help you set up and run your professional Event Manager application.

## 🏗️ Project Structure Overview

Your Event Manager now follows professional software development standards:

```
event-manager/                          # Root project
├── frontend/                          # Desktop GUI Application
│   ├── src/Event_Manager/             # Main application package
│   ├── tests/                         # Frontend tests
│   ├── requirements-frontend.txt      # Frontend dependencies
│   └── README.md                      # Frontend documentation
├── backend/                           # Django REST API
│   ├── eventmanager/                  # Django project
│   ├── manage.py                      # Django management
│   ├── requirements-backend.txt       # Backend dependencies
│   └── README.md                      # Backend documentation
├── docs/                              # Comprehensive documentation
├── scripts/                           # Setup and deployment scripts
└── README.md                          # Main project documentation
```

## 🚀 Quick Start

### Step 1: Install Dependencies

**Option A - Install All Dependencies:**
```bash
pip install -r requirements.txt
```

**Option B - Install Separately:**
```bash
# Backend dependencies
cd backend
pip install -r requirements-backend.txt
cd ..

# Frontend dependencies
cd frontend
pip install -r requirements-frontend.txt
cd ..
```

### Step 2: Set Up Backend (Django API)

```bash
cd backend

# Create database tables
python manage.py migrate

# Create admin user (optional)
python manage.py createsuperuser

# Start the backend server
python manage.py runserver
```

The API will be available at: `http://localhost:8000/api/`

### Step 3: Run Frontend (Desktop App)

```bash
cd frontend/src
python -m Event_Manager
```

## 🧪 Testing Your Setup

Run the test script to verify everything is working:

```bash
python test_setup.py
```

This will check:
- ✅ Dependencies are installed
- ✅ Frontend can be imported and initialized
- ✅ Backend Django configuration is correct
- ✅ Database models are accessible

## 🎯 What You Can Do Now

### Backend API Features:
- **Event Management**: Full CRUD operations for events
- **API Endpoints**: RESTful API at `/api/events/`
- **Admin Interface**: Django admin at `/admin/`
- **Filtering**: Filter events by date, location
- **Special Endpoints**: `/api/events/upcoming/`, `/api/events/past/`

### Frontend GUI Features:
- **Cross-platform**: Works on Windows, macOS, Linux
- **Modern Interface**: Native GUI using Toga framework
- **Event Management**: Create and view events (buttons ready for implementation)
- **API Integration**: Ready to connect to backend API

## 🔧 Development Workflow

### Running in Development Mode:

1. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend/src
   python -m Event_Manager
   ```

### Making Changes:

**Backend Changes:**
- Edit models in `backend/eventmanager/events/models.py`
- Add API endpoints in `backend/eventmanager/events/views.py`
- Run migrations: `python manage.py makemigrations && python manage.py migrate`

**Frontend Changes:**
- Edit GUI in `frontend/src/Event_Manager/app.py`
- Add new views in `frontend/src/Event_Manager/views/`
- Update API client in `frontend/src/Event_Manager/services/api_client.py`

## 📚 Documentation

- **[API Documentation](docs/api/README.md)** - Complete API reference
- **[User Guide](docs/user-guide/README.md)** - How to use the application
- **[Development Guide](docs/development/README.md)** - Development setup and guidelines

## 🐛 Troubleshooting

### Common Issues:

**"No module named 'toga'" Error:**
```bash
pip install toga-winforms  # For Windows
pip install toga-cocoa     # For macOS
pip install toga-gtk       # For Linux
```

**"No module named 'django'" Error:**
```bash
pip install django djangorestframework
```

**Frontend Won't Start:**
- Make sure you're in the `frontend/src` directory
- Check that dependencies are installed: `pip install -r ../requirements-frontend.txt`

**Backend Won't Start:**
- Make sure you're in the `backend` directory
- Run migrations: `python manage.py migrate`
- Check database permissions

### Getting Help:

1. Run the test script: `python test_setup.py`
2. Check the error messages carefully
3. Verify you're in the correct directory
4. Ensure all dependencies are installed

## 🎉 Next Steps

Your Event Manager is now professionally structured and ready for development! Here's what you can do next:

1. **Enhance the GUI**: Add more sophisticated event creation forms
2. **Connect Frontend to Backend**: Implement API calls in the GUI
3. **Add Features**: User authentication, event categories, reminders
4. **Deploy**: Use the deployment scripts in the `scripts/` directory
5. **Contribute**: Follow the development guide to add new features

Happy coding! 🚀
