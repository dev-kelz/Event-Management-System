import os

class AssetManager:
    """Centralized asset management for the Event Management System"""
    
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ASSETS_DIR = os.path.join(BASE_DIR, 'assets')
    IMAGES_DIR = os.path.join(ASSETS_DIR, 'images')
    ICONS_DIR = os.path.join(IMAGES_DIR, 'icons')
    EVENTS_DIR = os.path.join(IMAGES_DIR, 'events')
    
    @staticmethod
    def get_image(filename):
        """Get path to an image in the images directory"""
        return os.path.join(AssetManager.IMAGES_DIR, filename)
    
    @staticmethod
    def get_icon(filename):
        """Get path to an icon in the icons directory"""
        return os.path.join(AssetManager.ICONS_DIR, filename)
    
    @staticmethod
    def get_event_image(filename):
        """Get path to an event image in the events directory"""
        return os.path.join(AssetManager.EVENTS_DIR, filename)
    
    @staticmethod
    def ensure_directories():
        """Ensure all asset directories exist"""
        os.makedirs(AssetManager.IMAGES_DIR, exist_ok=True)
        os.makedirs(AssetManager.ICONS_DIR, exist_ok=True)
        os.makedirs(AssetManager.EVENTS_DIR, exist_ok=True)
