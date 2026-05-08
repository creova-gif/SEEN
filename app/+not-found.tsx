import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

export default function NotFoundScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Ionicons name="alert-circle-outline" size={60} color={Colors.textMuted} />
      <Text style={styles.title}>Screen not found</Text>
      <Text style={styles.sub}>The page you were looking for doesn't exist.</Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.btnText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
    padding: 40, gap: 16,
  },
  title: { fontSize: 22, fontFamily: Colors.fontBold, color: Colors.textPrimary },
  sub: { fontSize: 14, fontFamily: Colors.fontRegular, color: Colors.textMuted, textAlign: 'center' },
  btn: {
    marginTop: 16,
    backgroundColor: Colors.amber,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: Colors.radius,
  },
  btnText: { fontSize: 15, fontFamily: Colors.fontSemiBold, color: '#000' },
});
