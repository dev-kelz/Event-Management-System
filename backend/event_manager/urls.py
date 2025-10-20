"""
Main URL configuration for Event Manager project.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    # Add other app URLs here if needed
]
