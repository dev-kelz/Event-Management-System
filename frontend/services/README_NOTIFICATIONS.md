# Notification System Documentation

## Overview
This app uses two types of notifications:
1. **Toast Notifications** - For immediate in-app feedback (success/error messages)
2. **Push Notifications** - For background notifications and alerts

## Toast Notifications (Already Implemented)

### Usage Examples

```javascript
import toastService from '../services/toastService';

// Success message
toastService.success('Event created successfully!', 'Success');

// Error message
toastService.error('Failed to create event', 'Error');

// Info message
toastService.info('Event starts in 30 minutes', 'Reminder');

// Warning message
toastService.warning('Your session will expire soon', 'Warning');

// Hide current toast
toastService.hide();
```

### Where to Use Toast Notifications
- Form submissions (success/failure)
- User actions (save, delete, update)
- Validation errors
- Quick confirmations
- Network errors

## Push Notifications Setup

### Step 1: Request Permission (in App.js or Settings screen)

```javascript
import notificationService from '../services/notificationService';

// Request permission when app starts or in settings
React.useEffect(() => {
  const setupNotifications = async () => {
    const hasPermission = await notificationService.requestPermission();
    if (hasPermission) {
      const token = await notificationService.registerForPushNotifications();
      // Send token to your backend
      console.log('Push Token:', token);
    }
  };
  
  setupNotifications();
}, []);
```

### Step 2: Listen for Notifications

```javascript
import notificationService from '../services/notificationService';

React.useEffect(() => {
  // Listen for notifications when app is in foreground
  const receivedListener = notificationService.addNotificationReceivedListener(
    (notification) => {
      console.log('Notification received:', notification);
      // Show toast or update UI
      toastService.info(notification.request.content.body, notification.request.content.title);
    }
  );

  // Listen for user tapping notification
  const responseListener = notificationService.addNotificationResponseListener(
    (response) => {
      console.log('Notification tapped:', response);
      const data = response.notification.request.content.data;
      // Navigate to specific screen based on data
      if (data.screen) {
        navigation.navigate(data.screen, data.params);
      }
    }
  );

  // Cleanup
  return () => {
    receivedListener.remove();
    responseListener.remove();
  };
}, []);
```

### Step 3: Send Local Notifications (No Backend Required)

```javascript
import notificationService from '../services/notificationService';

// Send immediately
await notificationService.sendLocalNotification(
  'Event Reminder',
  'Your event starts in 1 hour!',
  { eventId: 123, screen: 'EventDetails' }
);

// Schedule for later
const eventDate = new Date();
eventDate.setHours(eventDate.getHours() + 1); // 1 hour from now

await notificationService.scheduleNotification(
  'Event Starting Soon',
  'Your event is about to start',
  eventDate,
  { eventId: 123, screen: 'EventDetails' }
);
```

### Step 4: Backend Integration (FastAPI)

When you're ready to connect to your FastAPI backend:

**1. Send push token to backend:**
```javascript
// After getting token
const token = await notificationService.registerForPushNotifications();
if (token) {
  await fetch('http://your-api/api/register-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      userId: currentUser.id, 
      pushToken: token 
    })
  });
}
```

**2. FastAPI endpoint to send notifications:**
```python
import requests

@app.post("/send-notification")
async def send_notification(user_id: int, title: str, body: str):
    # Get user's push token from database
    push_token = await db.get_user_push_token(user_id)
    
    # Send via Expo Push API
    response = requests.post(
        'https://exp.host/--/api/v2/push/send',
        json={
            'to': push_token,
            'title': title,
            'body': body,
            'sound': 'default',
            'data': {'eventId': 123}
        }
    )
    return response.json()
```

## Configuration

### Update Expo Project ID
In `notificationService.js`, update the project ID:
```javascript
const token = await Notifications.getExpoPushTokenAsync({
  projectId: 'your-actual-expo-project-id', // Find in app.json
});
```

Find your project ID in `app.json` under `expo.extra.eas.projectId` or by running:
```bash
npx expo config
```

## Examples for Your Event Management App

### Event Created
```javascript
toastService.success('Event created successfully!');
await notificationService.sendLocalNotification(
  'Event Created',
  'Your event has been created and is now live!'
);
```

### Event Reminder (1 hour before)
```javascript
const eventDate = new Date(event.date);
const reminderDate = new Date(eventDate.getTime() - 60 * 60 * 1000); // 1 hour before

await notificationService.scheduleNotification(
  'Event Reminder',
  `Your event "${event.name}" starts in 1 hour`,
  reminderDate,
  { eventId: event.id, screen: 'EventDetails' }
);
```

### Booking Confirmation
```javascript
toastService.success('Booking confirmed!', 'Success');
await notificationService.sendLocalNotification(
  'Booking Confirmed',
  `You're all set for ${event.name}`,
  { eventId: event.id }
);
```

## Testing

### Test Toast Notifications
They should work immediately after implementing them in screens.

### Test Push Notifications
1. Run app on physical device or simulator
2. Grant notification permission when prompted
3. Use the notification service to send local notifications
4. Test scheduled notifications by setting a time a few seconds in future

### Production Push Notifications
For production with backend:
1. Build your app with EAS Build
2. Get production push certificates
3. Test with Expo's push notification tool: https://expo.dev/notifications

## Troubleshooting

**Toast not showing:**
- Make sure `<Toast />` is in App.js at root level
- Check import is correct

**Push notifications not working:**
- Check permission was granted
- Verify projectId in notificationService.js
- Test on physical device (simulators have limitations)
- Check console for token errors

**Scheduled notifications not firing:**
- Ensure app has background permissions
- Check date is in future
- Verify device isn't in Do Not Disturb mode
