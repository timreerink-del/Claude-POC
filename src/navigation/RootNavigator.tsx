import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { JobDetailScreen } from '../screens/JobDetailScreen';
import { FilterSheet } from '../screens/FilterSheet';
import { MapViewScreen } from '../screens/MapViewScreen';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Onboarding">
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="JobDetail" component={JobDetailScreen} />
      <Stack.Screen
        name="MapView"
        component={MapViewScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen
        name="FilterSheet"
        component={FilterSheet}
        options={{
          presentation: 'transparentModal',
          animation: 'none',
        }}
      />
    </Stack.Navigator>
  );
}
