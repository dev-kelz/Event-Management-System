#!/usr/bin/env python3
"""
Test script to verify the Event Manager setup is working correctly.
"""

import sys
import os
import subprocess
from pathlib import Path

def test_frontend():
    """Test if the frontend can be imported and initialized."""
    print("🔍 Testing Frontend...")
    
    # Add frontend src to path
    frontend_src = Path("frontend/src")
    if frontend_src.exists():
        sys.path.insert(0, str(frontend_src))
        
        try:
            from Event_Manager.app import EventManagerApp
            app = EventManagerApp()
            print("✅ Frontend app can be imported and initialized")
            print(f"   App Name: {app.formal_name}")
            print(f"   App ID: {app.app_id}")
            return True
        except ImportError as e:
            print(f"❌ Frontend import failed: {e}")
            return False
    else:
        print("❌ Frontend src directory not found")
        return False

def test_backend():
    """Test if the backend Django project is properly configured."""
    print("\n🔍 Testing Backend...")
    
    backend_dir = Path("backend")
    if backend_dir.exists():
        # Change to backend directory
        original_cwd = os.getcwd()
        os.chdir(backend_dir)
        
        try:
            # Test Django settings
            os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eventmanager.settings')
            
            import django
            from django.conf import settings
            django.setup()
            
            print("✅ Django backend configured successfully")
            print(f"   Settings Module: {settings.SETTINGS_MODULE}")
            print(f"   Debug Mode: {settings.DEBUG}")
            
            # Test if we can import the Event model
            from eventmanager.events.models import Event
            print("✅ Event model can be imported")
            
            os.chdir(original_cwd)
            return True
            
        except Exception as e:
            print(f"❌ Backend test failed: {e}")
            os.chdir(original_cwd)
            return False
    else:
        print("❌ Backend directory not found")
        return False

def check_dependencies():
    """Check if required dependencies are available."""
    print("\n🔍 Checking Dependencies...")
    
    dependencies = {
        'toga': 'Frontend GUI framework',
        'django': 'Backend web framework',
        'requests': 'HTTP client for API calls'
    }
    
    missing = []
    for dep, description in dependencies.items():
        try:
            __import__(dep)
            print(f"✅ {dep}: {description}")
        except ImportError:
            print(f"❌ {dep}: {description} - NOT INSTALLED")
            missing.append(dep)
    
    return len(missing) == 0

def main():
    """Run all tests."""
    print("🚀 Event Manager Setup Test")
    print("=" * 50)
    
    # Check current directory
    current_dir = Path.cwd()
    print(f"📁 Current Directory: {current_dir}")
    
    # Run tests
    deps_ok = check_dependencies()
    frontend_ok = test_frontend()
    backend_ok = test_backend()
    
    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"   Dependencies: {'✅ PASS' if deps_ok else '❌ FAIL'}")
    print(f"   Frontend: {'✅ PASS' if frontend_ok else '❌ FAIL'}")
    print(f"   Backend: {'✅ PASS' if backend_ok else '❌ FAIL'}")
    
    if all([deps_ok, frontend_ok, backend_ok]):
        print("\n🎉 All tests passed! Your Event Manager is ready to use.")
        print("\nTo run the applications:")
        print("   Backend:  cd backend && python manage.py runserver")
        print("   Frontend: cd frontend/src && python -m Event_Manager")
    else:
        print("\n⚠️  Some tests failed. Please check the issues above.")
        
        if not deps_ok:
            print("\n📦 To install missing dependencies:")
            print("   pip install -r requirements.txt")

if __name__ == "__main__":
    main()
