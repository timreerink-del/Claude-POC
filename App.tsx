import './global.css';

import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {
  NotoSans_400Regular,
  NotoSans_500Medium,
  NotoSans_600SemiBold,
} from '@expo-google-fonts/noto-sans';
import { RootNavigator } from './src/navigation';
import { colors } from './src/tokens';

export default function App() {
  // On web, fonts + icons load via CSS @font-face in global.css. We pass an
  // empty map to useFonts on web so it doesn't create FontFace objects from
  // the Metro-bundled asset URLs — those resolve to paths that 404 on the
  // deployed build, ending up as error-state entries in document.fonts that
  // then poison font matching and cause all text to fall back to serif.
  const [fontsLoaded] = useFonts(
    Platform.OS === 'web'
      ? {}
      : {
          NotoSans_400Regular,
          NotoSans_500Medium,
          NotoSans_600SemiBold,
        }
  );

  // On native, wait for JS font loading to complete
  if (!fontsLoaded && Platform.OS !== 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
