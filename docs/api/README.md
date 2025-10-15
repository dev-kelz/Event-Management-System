# API Documentation

The Event Manager API provides RESTful endpoints for managing events.

## Base URL

```
http://localhost:8000/api/
```

## Authentication

The API uses session-based authentication. For development, you can access most endpoints without authentication, but creating/updating events requires authentication.

## Endpoints

### Events

#### List Events
```http
GET /api/events/
```

**Query Parameters:**
- `start_date` (optional) - Filter by start date (YYYY-MM-DD)
- `end_date` (optional) - Filter by end date (YYYY-MM-DD)
- `location` (optional) - Filter by location (case-insensitive)

**Response:**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Team Meeting",
      "description": "Weekly team sync",
      "start_date": "2024-01-15T10:00:00Z",
      "end_date": "2024-01-15T11:00:00Z",
      "location": "Conference Room A",
      "created_by": "admin",
      "created_at": "2024-01-10T09:00:00Z",
      "updated_at": "2024-01-10T09:00:00Z",
      "duration": "1:00:00"
    }
  ]
}
```

#### Create Event
```http
POST /api/events/
```

**Request Body:**
```json
{
  "title": "New Event",
  "description": "Event description",
  "start_date": "2024-01-20T14:00:00Z",
  "end_date": "2024-01-20T16:00:00Z",
  "location": "Meeting Room B"
}
```

#### Get Event
```http
GET /api/events/{id}/
```

#### Update Event
```http
PUT /api/events/{id}/
```

#### Delete Event
```http
DELETE /api/events/{id}/
```

#### Upcoming Events
```http
GET /api/events/upcoming/
```

#### Past Events
```http
GET /api/events/past/
```

## Error Responses

The API returns standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "detail": "Error message",
  "field_errors": {
    "field_name": ["Error for this field"]
  }
}
```
