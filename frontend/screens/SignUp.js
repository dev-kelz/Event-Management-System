import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator, ImageBackground } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import authService from '../services/authService';

const SignUp = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Register user via API
      await authService.register(formData);
      
      Alert.alert(
        'Success',
        'Account created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MainTabs')
          }
        ]
      );
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };


  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800' }}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Signup</Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={formData.firstName}
                onChangeText={(text) => handleChange('firstName', text)}
                autoCapitalize="words"
                placeholderTextColor="#999"
              />
              {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={(text) => handleChange('lastName', text)}
                autoCapitalize="words"
                placeholderTextColor="#999"
              />
              {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholderTextColor="#999"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Create password"
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                placeholderTextColor="#999"
              />
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleChange('confirmPassword', text)}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="new-password"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

              <TouchableOpacity 
                style={styles.signUpButton} 
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signUpButtonText}>Signup</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginLink}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 25,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000',
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 4,
  },
  signUpButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#000',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default SignUp;