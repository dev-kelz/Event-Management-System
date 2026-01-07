import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const GetStartedScreen = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.navigate('SignUp');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.95)']}
          style={styles.gradient}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Welcome to Event Management System</Text>
            <Text style={styles.subtitle}>
              Plan, organize, and manage unforgettable events with ease.
            </Text>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 30,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  loginLink: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default GetStartedScreen;