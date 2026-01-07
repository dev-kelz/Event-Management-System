import { API_BASE_URL } from '../config';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        username: userData.username,
        email: userData.email,
        password: userData.password,
      }),
    });
  }

  async login(email, password) {
    return this.request('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    });
  }

  // Event endpoints
  async getEvents() {
    return this.request('/api/events');
  }

  async createEvent(eventData) {
    // For events with images, we need to use FormData
    const formData = new FormData();
    formData.append('title', eventData.title);
    formData.append('time', eventData.time);
    formData.append('date', eventData.date);
    formData.append('location', eventData.location);
    formData.append('description', eventData.description);
    
    if (eventData.image) {
      formData.append('image', eventData.image);
    }

    const url = `${this.baseURL}/api/events`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create event');
      }

      return data;
    } catch (error) {
      console.error('Create Event Error:', error);
      throw error;
    }
  }

  // User profile endpoints
  async getProfile(userId) {
    return this.request(`/api/users/${userId}`);
  }

  async updateProfile(userId, profileData) {
    return this.request(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getEventById(eventId) {
    return this.request(`/api/events/${eventId}`);
  }

  async updateEvent(eventId, eventData) {
    return this.request(`/api/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(eventId) {
    return this.request(`/api/events/${eventId}`, {
      method: 'DELETE',
    });
  }

  // Analytics endpoints
  async getEventAnalytics(eventId) {
    return this.request(`/api/analytics/event/${eventId}`);
  }

  async getDashboardAnalytics(userId) {
    return this.request(`/api/analytics/dashboard?user_id=${userId}`);
  }

  async trackEventView(eventId) {
    return this.request(`/api/events/${eventId}/view`, {
      method: 'POST',
    });
  }

  // Registration endpoints
  async registerForEvent(eventId, userId) {
    return this.request('/api/registrations', {
      method: 'POST',
      body: JSON.stringify({
        event_id: eventId,
        user_id: userId,
      }),
    });
  }

  async checkInEvent(registrationId) {
    return this.request(`/api/registrations/${registrationId}/check-in`, {
      method: 'POST',
    });
  }

  // Feedback endpoints
  async submitFeedback(eventId, userId, rating, comment) {
    return this.request('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({
        event_id: eventId,
        user_id: userId,
        rating,
        comment,
      }),
    });
  }

  async getEventFeedback(eventId) {
    return this.request(`/api/feedback/event/${eventId}`);
  }
}

export default new ApiService();
