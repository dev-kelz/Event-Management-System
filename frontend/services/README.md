# API Services Setup

## Overview
The services are now fully integrated with the FastAPI backend.

## Installation Required

Before using the services, install the required dependency:

```bash
npm install @react-native-async-storage/async-storage
```

## Backend Setup

1. **Start the backend server:**
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Create an admin user (optional):**
   ```bash
   python create_admin.py
   ```

## API Endpoints

The following endpoints are available:

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/{id}` - Get event by ID
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event

### Users
- `GET /api/users/{id}` - Get user profile

## Configuration

Update the API base URL in `config.js`:

```javascript
export const API_BASE_URL = 'http://127.0.0.1:8000';
```

**For physical devices:**
- Find your computer's IP address: Run `ipconfig` in Command Prompt
- Update to: `export const API_BASE_URL = 'http://YOUR_IP:8000';`

## Services

### authService.js
Handles user authentication:
- `register(userData)` - Register new user
- `login(email, password)` - Login user
- `logout()` - Logout user
- `getCurrentUser()` - Get current user from storage
- `isLoggedIn()` - Check if user is logged in

### apiService.js
Handles API requests:
- `register(userData)` - Register endpoint
- `login(email, password)` - Login endpoint
- `getEvents()` - Get all events
- `createEvent(eventData)` - Create new event
- `getEventById(eventId)` - Get specific event
- `updateEvent(eventId, eventData)` - Update event
- `deleteEvent(eventId)` - Delete event
- `getProfile(userId)` - Get user profile
- `updateProfile(userId, profileData)` - Update user profile

## Usage Examples

### Registration
```javascript
import authService from './services/authService';

const userData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123'
};

await authService.register(userData);
```

### Login
```javascript
await authService.login('john@example.com', 'SecurePass123');
```

### Get Events
```javascript
import apiService from './services/apiService';

const response = await apiService.getEvents();
console.log(response.events);
```

### Create Event
```javascript
const eventData = {
  title: 'Tech Conference',
  description: 'Annual tech conference',
  date: '2025-12-01',
  location: 'Convention Center',
  created_by: 1
};

await apiService.createEvent(eventData);
```

## Error Handling

All services include error handling and will throw errors that can be caught:

```javascript
try {
  await authService.login(email, password);
} catch (error) {
  Alert.alert('Error', error.message);
}
```

## Data Storage

User data is stored in AsyncStorage with the key `@user`:
- Automatically saved on login/registration
- Automatically cleared on logout
- Used by ProfileScreen to display user information
