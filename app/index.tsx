import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/colors';

export default function IndexScreen() {
  useEffect(() => {
    const check = async () => {
      try {
        const done = await AsyncStorage.getItem('seenos_onboarding_complete');
        if (done === 'true') {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      } catch {
        router.replace('/onboarding');
      }
    };
    check();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator color={Colors.amber} size="large" />
    </View>
  );
}
