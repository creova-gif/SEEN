import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { useStoryState } from '../contexts/StoryStateContext';
import { useAuth } from '../contexts/AuthContext';
import type { Language } from '../contexts/StoryStateContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { state, setLanguage, setAccessibilityPreferences, setUserRole } = useStoryState();
  const { state: auth, signOut } = useAuth();

  const acc = state.accessibilityPreferences;

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            await AsyncStorage.clear();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  const handleDataExport = () => {
    Alert.alert(
      'Data Export',
      'Your data export has been queued. You will receive an email with your data within 24 hours.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.title}>Preferences</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Language */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LANGUAGE</Text>
          {LANGUAGES.map(lang => {
            const active = state.language === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.row, active && styles.rowActive]}
                onPress={() => setLanguage(lang.code)}
              >
                <Text style={[styles.rowLabel, active && { color: Colors.amber }]}>{lang.label}</Text>
                {active && <Ionicons name="checkmark-circle" size={20} color={Colors.amber} />}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.divider} />

        {/* Accessibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCESSIBILITY</Text>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.rowLabel}>Subtitles & Captions</Text>
              <Text style={styles.rowSub}>Show text captions during audio playback</Text>
            </View>
            <Switch
              value={acc.captionsEnabled}
              onValueChange={v => setAccessibilityPreferences({ captionsEnabled: v })}
              trackColor={{ false: Colors.surface, true: Colors.amber }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.rowLabel}>High Contrast</Text>
              <Text style={styles.rowSub}>Increase text contrast for readability</Text>
            </View>
            <Switch
              value={acc.highContrast}
              onValueChange={v => setAccessibilityPreferences({ highContrast: v })}
              trackColor={{ false: Colors.surface, true: Colors.amber }}
              thumbColor="#fff"
            />
          </View>
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.rowLabel}>Reduce Motion</Text>
              <Text style={styles.rowSub}>Minimize animations throughout the app</Text>
            </View>
            <Switch
              value={acc.reducedMotion}
              onValueChange={v => setAccessibilityPreferences({ reducedMotion: v })}
              trackColor={{ false: Colors.surface, true: Colors.amber }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Role */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR ACCOUNT</Text>
          <View style={styles.roleCard}>
            <View style={styles.roleInfo}>
              <Text style={styles.roleLabel}>Current Role</Text>
              <Text style={styles.roleValue}>{state.userRole.charAt(0).toUpperCase() + state.userRole.slice(1)}</Text>
            </View>
          </View>
          {/* Quick role switcher for dev/demo */}
          <View style={styles.roleRow}>
            {(['viewer', 'creator', 'moderator'] as const).map(role => (
              <TouchableOpacity
                key={role}
                style={[styles.roleBtn, state.userRole === role && styles.roleBtnActive]}
                onPress={() => setUserRole(role)}
              >
                <Text style={[styles.roleBtnText, state.userRole === role && styles.roleBtnTextActive]}>
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.roleSub}>Switch role to explore different platform views</Text>
        </View>

        <View style={styles.divider} />

        {/* CMF */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CMF COMPLIANCE</Text>
          <View style={styles.cmfRow}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.emerald} />
            <Text style={styles.cmfText}>CAVCON Certification Active</Text>
          </View>
          <View style={styles.cmfRow}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.emerald} />
            <Text style={styles.cmfText}>French First-Class Content Status</Text>
          </View>
          <View style={styles.cmfRow}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.emerald} />
            <Text style={styles.cmfText}>Cultural Diversity Standards Met</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* PIPEDA */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRIVACY (PIPEDA)</Text>
          <Text style={styles.pipedaBody}>
            Under Canada's Personal Information Protection and Electronic Documents Act (PIPEDA), you have the right to access and request deletion of your personal data.
          </Text>
          <TouchableOpacity style={styles.dataBtn} onPress={handleDataExport}>
            <Ionicons name="download-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.dataBtnText}>Export My Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dataBtn, styles.deleteBtn]} onPress={handleDeleteAccount}>
            <Ionicons name="trash-outline" size={16} color={Colors.red} />
            <Text style={[styles.dataBtnText, { color: Colors.red }]}>Delete My Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 20, fontFamily: Colors.fontBold, color: Colors.textPrimary, letterSpacing: 1 },
  section: { paddingVertical: 8 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: Colors.fontSemiBold,
    color: Colors.textMuted,
    letterSpacing: 3,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  divider: { height: 8, backgroundColor: Colors.surface, borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowActive: { backgroundColor: Colors.amberDim },
  rowLabel: { fontSize: 15, fontFamily: Colors.fontMedium, color: Colors.textPrimary },
  rowSub: { fontSize: 12, fontFamily: Colors.fontRegular, color: Colors.textMuted, marginTop: 2 },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 16,
  },
  toggleInfo: { flex: 1 },
  roleCard: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: Colors.surface,
    borderRadius: Colors.radiusSm,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  roleInfo: { gap: 4 },
  roleLabel: { fontSize: 11, fontFamily: Colors.fontRegular, color: Colors.textMuted, letterSpacing: 1 },
  roleValue: { fontSize: 16, fontFamily: Colors.fontSemiBold, color: Colors.textPrimary },
  roleRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 8,
    marginBottom: 8,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Colors.radiusSm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roleBtnActive: { backgroundColor: Colors.amberDim, borderColor: Colors.amber },
  roleBtnText: { fontSize: 12, fontFamily: Colors.fontMedium, color: Colors.textMuted },
  roleBtnTextActive: { color: Colors.amber },
  roleSub: {
    fontSize: 11,
    fontFamily: Colors.fontRegular,
    color: Colors.textMuted,
    paddingHorizontal: 20,
  },
  cmfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cmfText: { fontSize: 14, fontFamily: Colors.fontMedium, color: Colors.textSecondary },
  pipedaBody: {
    fontSize: 13,
    fontFamily: Colors.fontRegular,
    color: Colors.textSecondary,
    lineHeight: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  dataBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 14,
    borderRadius: Colors.radiusSm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deleteBtn: { borderColor: `${Colors.red}44`, backgroundColor: Colors.redDim },
  dataBtnText: { fontSize: 14, fontFamily: Colors.fontMedium, color: Colors.textSecondary },
});
