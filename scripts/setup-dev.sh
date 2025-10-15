#!/bin/bash
# Development environment setup script for Event Manager

echo "Setting up Event Manager development environment..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
pip install -r requirements-backend.txt

# Set up database
echo "Setting up database..."
python manage.py migrate

# Create superuser (optional)
echo "Would you like to create a superuser? (y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    python manage.py createsuperuser
fi

# Go back to root
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
pip install -r requirements-frontend.txt

# Go back to root
cd ..

echo "Development environment setup complete!"
echo ""
echo "To start the backend server:"
echo "  cd backend && python manage.py runserver"
echo ""
echo "To start the frontend application:"
echo "  cd frontend/src && python -m event_manager"
