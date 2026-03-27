/**
 * DMP Prototype — Navigation Structure
 *
 * ROOT — Native Stack Navigator (no header)
 * ├── Onboarding (shown on first launch, manages 4 steps internally)
 * └── Main — Bottom Tab Navigator (4 tabs)
 *     ├── Discovery (home icon) → DiscoveryScreen / HomeScreen
 *     ├── Planning (calendar icon) → PlanningScreen (placeholder)
 *     ├── Careers (briefcase icon) → CareersScreen (placeholder)
 *     └── Profile (user icon) → ProfileScreen (placeholder)
 *
 * MODAL STACK (layered on top, no bottom tabs):
 * ├── ShiftDetail — slide from right, 300ms ease-in-out
 * └── FilterSheet — transparent modal, spring from bottom
 *
 * Transitions:
 * - Stack: horizontal slide, 300ms
 * - FilterSheet: spring (stiffness 280, damping 28)
 * - Tab switch: crossfade, 150ms
 * - Onboarding → Main: fade, 400ms
 */

import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabNavigator } from './BottomTabNavigator';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ShiftDetailScreen } from '../screens/ShiftDetailScreen';
import { FilterSheet } from '../screens/FilterSheet';
import { MapViewScreen } from '../screens/MapViewScreen';
import { LocationSearchScreen } from '../screens/LocationSearchScreen';
import { EmployerSearchScreen } from '../screens/EmployerSearchScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export const ONBOARDING_KEY = '@dmp_onboarding_complete';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  ProfileView: undefined;
  ShiftDetail: { jobId: string };
  FilterSheet: { selectedLocation?: string; selectedEmployer?: string } | undefined;
  MapView: undefined;
  LocationSearch: { initialLocation?: string } | undefined;
  EmployerSearch: { initialEmployer?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const [isReady, setIsReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((value) => {
        setHasOnboarded(value === 'true');
      })
      .catch(() => {
        setHasOnboarded(false);
      })
      .finally(() => {
        setIsReady(true);
      });
  }, []);

  if (!isReady) return null;

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={hasOnboarded ? 'Main' : 'Onboarding'}
    >
      {/* Onboarding — fade transition on complete */}
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          animation: 'fade',
          animationDuration: 400,
        }}
      />

      {/* Main app with bottom tabs */}
      <Stack.Screen
        name="Main"
        component={BottomTabNavigator}
        options={{
          animation: 'fade',
          animationDuration: 400,
        }}
      />

      {/* Profile — slides in from right, accessed via avatar */}
      <Stack.Screen
        name="ProfileView"
        component={ProfileScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 300,
        }}
      />

      {/* Shift detail — horizontal slide, 300ms */}
      <Stack.Screen
        name="ShiftDetail"
        component={ShiftDetailScreen}
        options={{
          animation: 'slide_from_right',
          animationDuration: 300,
        }}
      />

      {/* Map view — modal slide from bottom */}
      <Stack.Screen
        name="MapView"
        component={MapViewScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />

      {/* Filter sheet — transparent modal, slides up */}
      <Stack.Screen
        name="FilterSheet"
        component={FilterSheet}
        options={{
          presentation: 'transparentModal',
          animation: 'none',
        }}
      />

      {/* Location search — slides in from right */}
      <Stack.Screen
        name="LocationSearch"
        component={LocationSearchScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />

      {/* Employer search — slides in from right */}
      <Stack.Screen
        name="EmployerSearch"
        component={EmployerSearchScreen}
        options={{
          animation: 'slide_from_right',
        }}
      />

    </Stack.Navigator>
  );
}
