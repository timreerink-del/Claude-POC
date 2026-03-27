import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/HomeScreen';
import { PlanningScreen } from '../screens/PlanningScreen';
import { ConnectScreen } from '../screens/ConnectScreen';
import { MyWorkScreen } from '../screens/MyWorkScreen';
import { BottomNavBar } from '../components/navigation/BottomNavBar';

const Tab = createBottomTabNavigator();

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Discovery" component={HomeScreen} />
      <Tab.Screen name="Planning" component={PlanningScreen} />
      <Tab.Screen name="Connect" component={ConnectScreen} />
      <Tab.Screen name="Profile" component={MyWorkScreen} />
    </Tab.Navigator>
  );
}
