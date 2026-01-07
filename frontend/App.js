import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import GetStartedScreen from './screens/GetStarted';
import LoginScreen from './screens/LoginScreen';
import SignUp from './screens/SignUp';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import CreateEventScreen from './screens/CreateEventScreen';
import EventDetailsScreen from './screens/EventDetailsScreen';
import EventListScreen from './screens/EventListScreen';
import TaskManagementScreen from './screens/TaskManagementScreen';
import TaskListScreen from './screens/TaskListScreen';
import NotificationScreen from './screens/NotificationScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator 
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Task"
        component={TaskListScreen}
        options={{
          tabBarLabel: 'Task',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "checkbox" : "checkbox-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="GetStarted" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          {/* Create Event screen accessible from Home */}
          <Stack.Screen
            name="CreateEvent"
            component={CreateEventScreen}
            options={({ route }) => ({ 
              headerShown: true, 
              title: route.params?.editMode ? 'Edit Event' : 'Create Event' 
            })}
          />
          {/* Event Details screen */}
          <Stack.Screen
            name="EventDetails"
            component={EventDetailsScreen}
            options={{ headerShown: false }}
          />
          {/* Notification screen */}
          <Stack.Screen
            name="Notifications"
            component={NotificationScreen}
            options={{ headerShown: false }}
          />
          {/* Event List screen for navigation */}
          <Stack.Screen
            name="Event"
            component={EventListScreen}
            options={{ headerShown: true, title: 'Events' }}
          />
          {/* Task Management screen */}
          <Stack.Screen
            name="TaskManagement"
            component={TaskManagementScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
   
  );
}