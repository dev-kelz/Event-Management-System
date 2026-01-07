import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from './apiService';

class AuthService {
  // Keys for AsyncStorage
  USER_KEY = '@user';
  TOKEN_KEY = '@token';

  // Register new user
  async register(userData) {
    try {
      const response = await apiService.register(userData);
      
      if (response.success) {
        // Store user data after registration
        const user = {
          id: response.user.id,
          email: response.user.email,
          username: response.user.username,
          phone: '',
          bio: ''
        };
        await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
        return response;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      const response = await apiService.login(email, password);
      
      if (response.success) {
        // Store user data
        const userData = {
          id: response.user.id,
          email: response.user.email,
          username: response.user.username,
          phone: '',
          bio: ''
        };
        await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(userData));
        
        return response;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      await AsyncStorage.multiRemove([this.USER_KEY, this.TOKEN_KEY]);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const userData = await AsyncStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Check if user is logged in
  async isLoggedIn() {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  }
}

export default new AuthService();
