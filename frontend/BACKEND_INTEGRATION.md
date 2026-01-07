# Backend Integration Guide

This guide explains how the React Native frontend connects to the FastAPI backend.

## Prerequisites

### 1. Install Required Package

The app uses AsyncStorage to store user data locally. Install it:

```bash
cd frontend
npm install @react-native-async-storage/async-storage
```

### 2. Start the Backend Server

Make sure your FastAPI backend is running:

```bash
cd backend
uvicorn main:app --reload
```

The backend should be running at `http://127.0.0.1:8000`

### 3. Configure API URL

The frontend is configured to connect to `http://127.0.0.1:8000` in `config.js`.

**For physical devices or different networks:**
1. Find your computer's IP address:
   - Windows: Run `ipconfig` in Command Prompt
   - Mac/Linux: Run `ifconfig` in Terminal
2. Update `config.js`:
   ```javascript
   export const API_BASE_URL = 'http://YOUR_IP_ADDRESS:8000';
   ```

## What's Been Connected

### ✅ Authentication
- **SignUp Screen** → `/register` endpoint
- **Login Screen** → `/login` endpoint
- **Settings Logout** → Clears local storage

### ✅ Services Created

1. **apiService.js** - Handles all API requests
   ```javascript
   import apiService from './services/apiService';
   ```

2. **authService.js** - Manages authentication
   ```javascript
   import authService from './services/authService';
   ```

### ✅ Updated Screens

1. **SignUp.js**
   - Calls `authService.register(formData)`
   - Shows success toast
   - Redirects to Login on success

2. **LoginScreen.js**
   - Calls `authService.login(email, password)`
   - Stores user data in AsyncStorage
   - Shows success toast
   - Redirects to MainTabs on success

3. **SettingsScreen.js**
   - Logout button calls `authService.logout()`
   - Clears AsyncStorage
   - Redirects to Login

## API Endpoints Available

### Backend Endpoints (FastAPI)

```
POST /register
- Body: { username, email, password }
- Response: { success: true, message: "User registered successfully" }

POST /login
- Body: { email, password }
- Response: { success: true, message: "Login successful" }

GET /events/
- Response: Array of events

POST /events/
- Body: FormData with title, date, time, location, description, image
- Response: Created event object
```

## How Data Flows

### Registration Flow
```
User fills form → SignUp.js → authService.register()
                                       ↓
                              apiService.request('/register')
                                       ↓
                              FastAPI Backend (/register)
                                       ↓
                              Response → Show toast → Navigate to Login
```

### Login Flow
```
User enters credentials → LoginScreen.js → authService.login()
                                                    ↓
                                           apiService.request('/login')
                                                    ↓
                                           FastAPI Backend (/login)
                                                    ↓
                                           Store user in AsyncStorage
                                                    ↓
                                           Show toast → Navigate to MainTabs
```

### Logout Flow
```
User taps logout → SettingsScreen → authService.logout()
                                             ↓
                                    Clear AsyncStorage
                                             ↓
                                    Navigate to Login
```

## Testing the Integration

### 1. Test Registration

1. Start the backend: `uvicorn main:app --reload`
2. Start the frontend: `npx expo start`
3. Navigate to SignUp screen
4. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Password: password123
   - Confirm Password: password123
5. Tap "Create Account"
6. Should see success toast and redirect to Login

### 2. Test Login

1. On Login screen, enter:
   - Email: john@example.com
   - Password: password123
2. Tap "Sign In"
3. Should see success toast and redirect to Home

### 3. Test Logout

1. Navigate to Settings tab
2. Tap "Logout"
3. Confirm logout
4. Should redirect to Login screen

## Error Handling

The app handles these error cases:

- **Network errors** - Shows toast with error message
- **Invalid credentials** - Shows "Invalid email or password"
- **User already exists** - Shows "User already exists"
- **Validation errors** - Shows field-specific error messages

## Next Steps

### Add More Endpoints

The backend needs these additional endpoints for full functionality:

1. **User Profile**
   ```python
   @app.get("/users/{user_id}")
   def get_user_profile(user_id: int):
       # Return user profile data
   
   @app.put("/users/{user_id}")
   def update_user_profile(user_id: int, profile_data: dict):
       # Update user profile
   ```

2. **Events with User Context**
   ```python
   @app.get("/events/my-events")
   def get_my_events(user_id: int):
       # Return events created by user
   ```

3. **Notifications**
   ```python
   @app.get("/notifications/{user_id}")
   def get_notifications(user_id: int):
       # Return user notifications
   
   @app.post("/notifications")
   def create_notification(notification_data: dict):
       # Create notification
   ```

### Connect More Screens

Once backend endpoints are added:

1. **ProfileScreen** - Connect to user profile endpoints
2. **EventListScreen** - Already uses `/events/` endpoint
3. **CreateEventScreen** - Already uses `POST /events/` endpoint
4. **NotificationScreen** - Connect to notifications endpoint

## Troubleshooting

### "Network request failed"
- Make sure backend is running
- Check `config.js` has correct API_BASE_URL
- For physical devices, use computer's IP address

### "User already exists"
- User with that email is already registered
- Try a different email or check backend database

### AsyncStorage errors
- Make sure package is installed: `npm install @react-native-async-storage/async-storage`
- Clear app data and reinstall if persistent

### CORS errors (if any)
- Backend already has CORS middleware configured
- Should work with localhost and IP addresses

## Security Notes

For production deployment:

1. **Use HTTPS** - Never use HTTP in production
2. **Add JWT tokens** - Implement proper token-based authentication
3. **Secure AsyncStorage** - Consider encrypting sensitive data
4. **Environment variables** - Use `.env` files for API URLs
5. **Input validation** - Backend should validate all inputs
6. **Rate limiting** - Add rate limiting to prevent abuse

## Summary

Your frontend is now connected to the backend! 

**Working:**
- ✅ User registration
- ✅ User login
- ✅ User logout
- ✅ Event listing
- ✅ Event creation
- ✅ Toast notifications for feedback

**Ready to add:**
- 🔲 Profile management
- 🔲 Event editing/deletion
- 🔲 Push notifications integration
- 🔲 Image uploads for events
- 🔲 User authentication persistence
