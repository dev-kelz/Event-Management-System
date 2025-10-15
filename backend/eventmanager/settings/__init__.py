"""
Django settings package

Import the appropriate settings based on environment.
"""

import os

# Default to development settings
ENVIRONMENT = os.getenv('DJANGO_ENVIRONMENT', 'development')

if ENVIRONMENT == 'production':
    from .production import *
else:
    from .development import *
