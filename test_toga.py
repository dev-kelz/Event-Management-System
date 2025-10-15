#!/usr/bin/env python3
"""
Simple test to verify Toga installation and basic functionality.
"""

try:
    import toga
    from toga.style.pack import COLUMN, Pack
    print("✅ Toga imported successfully")
    
    # Test basic Pack syntax
    test_style = Pack(direction=COLUMN, padding=10)
    print("✅ Pack styling works correctly")
    
    print("🎉 Toga is properly installed and configured!")
    print("\nNow try running the frontend:")
    print("cd frontend/src && python -m Event_Manager")
    
except ImportError as e:
    print(f"❌ Toga import failed: {e}")
    print("Install with: pip install toga-winforms")
except Exception as e:
    print(f"❌ Toga test failed: {e}")
