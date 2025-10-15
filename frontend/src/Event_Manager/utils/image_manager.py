"""
Image Manager Utility

Handles image loading, caching, and management for the Event Manager application.
"""

import toga
from pathlib import Path
from typing import Optional, Dict


class ImageManager:
    """Manages images for the Event Manager application."""
    
    def __init__(self):
        self.image_cache: Dict[str, toga.Image] = {}
        self.resources_path = Path("resources")
    
    def get_icon(self, icon_name: str) -> Optional[toga.Image]:
        """
        Load an icon from the icons directory.
        
        Args:
            icon_name: Name of the icon file (with or without extension)
            
        Returns:
            toga.Image object or None if loading fails
        """
        # Add .svg extension if not provided
        if not icon_name.endswith(('.svg', '.png', '.jpg', '.jpeg')):
            icon_name += '.svg'
        
        icon_path = f"resources/icons/{icon_name}"
        
        # Check cache first
        if icon_path in self.image_cache:
            return self.image_cache[icon_path]
        
        try:
            image = toga.Image(icon_path)
            self.image_cache[icon_path] = image
            return image
        except Exception as e:
            print(f"Failed to load icon {icon_path}: {e}")
            return None
    
    def get_image(self, image_name: str) -> Optional[toga.Image]:
        """
        Load an image from the images directory.
        
        Args:
            image_name: Name of the image file
            
        Returns:
            toga.Image object or None if loading fails
        """
        image_path = f"resources/images/{image_name}"
        
        # Check cache first
        if image_path in self.image_cache:
            return self.image_cache[image_path]
        
        try:
            image = toga.Image(image_path)
            self.image_cache[image_path] = image
            return image
        except Exception as e:
            print(f"Failed to load image {image_path}: {e}")
            return None
    
    def get_placeholder(self) -> Optional[toga.Image]:
        """Get the placeholder image for events without photos."""
        return self.get_image("placeholder.svg")
    
    def clear_cache(self):
        """Clear the image cache to free memory."""
        self.image_cache.clear()
    
    def preload_common_images(self):
        """Preload commonly used images for better performance."""
        common_icons = [
            "logo.svg",
            "create_event.svg", 
            "view_events.svg"
        ]
        
        common_images = [
            "placeholder.svg"
        ]
        
        for icon in common_icons:
            self.get_icon(icon)
        
        for image in common_images:
            self.get_image(image)
        
        print(f"Preloaded {len(self.image_cache)} images")


# Global image manager instance
image_manager = ImageManager()
