# Event Manager - Image Guide

This guide explains how to add and manage images in your Event Manager application.

## 📁 Directory Structure

```
frontend/src/Event_Manager/resources/
├── icons/                  # UI Icons (16x16 to 64x64)
│   ├── logo.svg           # App logo
│   ├── create_event.svg   # Create button icon
│   └── view_events.svg    # View button icon
└── images/                # Larger images
    ├── placeholder.svg    # Event placeholder
    └── background.jpg     # App background (optional)
```

## 🖼️ Adding Your Own Images

### **Step 1: Replace SVG Placeholders**

The current setup uses SVG placeholders. To add real images:

1. **Logo** (`resources/icons/logo.png`):
   - Size: 64x64 or 128x128 pixels
   - Format: PNG (for transparency)
   - Your company/app logo

2. **Button Icons** (`resources/icons/`):
   - Size: 24x24 pixels
   - Format: PNG or SVG
   - Icons for create/view actions

3. **Placeholder** (`resources/images/placeholder.png`):
   - Size: 300x200 pixels
   - Format: PNG or JPEG
   - Default image for events

### **Step 2: Update File Extensions**

If you use PNG instead of SVG, update the code in `app.py`:

```python
# Change from:
logo_image = toga.Image("resources/icons/logo.svg")

# To:
logo_image = toga.Image("resources/icons/logo.png")
```

### **Step 3: Using the Image Manager**

```python
from Event_Manager.utils.image_manager import image_manager

# Load icons
logo = image_manager.get_icon("logo")
create_icon = image_manager.get_icon("create_event")

# Load images
placeholder = image_manager.get_placeholder()
```

## 🎨 Image Guidelines

### **Icons (24x24 to 64x64)**
- **Format**: PNG (transparency) or SVG (scalable)
- **Style**: Consistent design language
- **Colors**: Match your app theme
- **Background**: Transparent

### **Images (300x200 and larger)**
- **Format**: JPEG (photos) or PNG (graphics)
- **Optimization**: Compress for web
- **Dimensions**: Keep reasonable (max 800x600)
- **Quality**: Balance size vs quality

## 🔧 Implementation Examples

### **Adding Event Photos**

```python
class EventManagerApp(toga.App):
    def show_event_details(self, event_id):
        # Try to load event-specific image
        event_image = image_manager.get_image(f"event_{event_id}.jpg")
        
        if not event_image:
            # Fall back to placeholder
            event_image = image_manager.get_placeholder()
        
        image_view = toga.ImageView(
            image=event_image,
            style=Pack(width=300, height=200, padding=10)
        )
```

### **Dynamic Icon Loading**

```python
def create_icon_button(self, text, icon_name, callback):
    """Create a button with an icon."""
    icon = image_manager.get_icon(icon_name)
    
    if icon:
        return toga.Button(
            text,
            icon=icon,
            on_press=callback,
            style=Pack(padding=5, width=150)
        )
    else:
        # Fallback without icon
        return toga.Button(
            f"• {text}",
            on_press=callback,
            style=Pack(padding=5, width=150)
        )
```

## 📱 Platform Considerations

### **Windows**
- PNG and JPEG work well
- SVG support may vary
- Test icon sizes on different DPI settings

### **macOS**
- Excellent PNG/JPEG support
- SVG support available
- Retina display considerations

### **Linux**
- PNG/JPEG widely supported
- SVG support depends on system
- Test on target distributions

## 🚀 Performance Tips

1. **Preload Common Images**:
   ```python
   image_manager.preload_common_images()
   ```

2. **Use Appropriate Formats**:
   - PNG for icons/graphics with transparency
   - JPEG for photos
   - SVG for scalable graphics

3. **Optimize File Sizes**:
   - Compress images before adding
   - Use tools like TinyPNG or ImageOptim
   - Keep total resource size reasonable

4. **Cache Management**:
   ```python
   # Clear cache if memory usage is high
   image_manager.clear_cache()
   ```

## 🎯 Next Steps

1. **Replace placeholder SVGs** with your actual images
2. **Update file paths** in the code if needed
3. **Test on different platforms** to ensure compatibility
4. **Optimize images** for performance
5. **Add more event-specific images** as needed

Your Event Manager now has a complete image management system! 🎉
