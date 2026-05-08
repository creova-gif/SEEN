import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import { useStoryState } from '../../contexts/StoryStateContext';

const ROLE_COLORS: Record<string, string> = {
  viewer: Colors.textMuted,
  creator: Colors.violet,
  moderator: Colors.amber,
  admin: Colors.red,
};

const ROLE_LABELS: Record<string, string> = {
  viewer: 'Viewer',
  creator: 'Creator',
  moderator: 'Moderator',
  admin: 'Administrator',
};

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  value?: string;
  accent?: string;
  danger?: boolean;
}

function MenuItem({ icon, label, value, onPress, danger }: MenuItemProps) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon as any} size={18} color={danger ? Colors.red : Colors.textSecondary} />
      </View>
      <Text style={[styles.menuLabel, danger && { color: Colors.red }]}>{label}</Text>
      <View style={styles.menuRight}>
        {value && <Text style={styles.menuValue}>{value}</Text>}
        {!danger && <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />}
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { state: auth, signOut } = useAuth();
  const { state } = useStoryState();

  const user = auth.user;
  const role = state.userRole;
  const roleColor = ROLE_COLORS[role] ?? Colors.textMuted;
  const roleLabel = ROLE_LABELS[role] ?? 'Viewer';

  const initials = user
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'GU';
  const displayName = user?.name ?? 'Guest User';
  const displayEmail = user?.email ?? 'Not signed in';

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* User card */}
        <View style={styles.userCard}>
          <View style={[styles.avatar, { borderColor: roleColor }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{displayEmail}</Text>
            <View style={[styles.roleBadge, { backgroundColor: `${roleColor}20`, borderColor: `${roleColor}44` }]}>
              <Ionicons
                name={role === 'moderator' ? 'shield-checkmark' : role === 'creator' ? 'mic' : 'person'}
                size={12}
                color={roleColor}
              />
              <Text style={[styles.roleText, { color: roleColor }]}>{roleLabel.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Stories', value: '12' },
            { label: 'Hours', value: '24' },
            { label: 'Languages', value: '2' },
          ].map(stat => (
            <View key={stat.label} style={styles.stat}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Account section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <MenuItem
            icon="settings-outline"
            label="Preferences"
            onPress={() => router.push('/settings')}
          />
          <MenuItem
            icon="globe-outline"
            label="Language"
            value={state.language === 'fr' ? 'Français' : state.language === 'es' ? 'Español' : 'English'}
            onPress={() => router.push('/settings')}
          />
          <MenuItem
            icon="accessibility-outline"
            label="Accessibility"
            onPress={() => router.push('/settings')}
          />
        </View>

        <View style={styles.divider} />

        {/* Creator / role section */}
        {role === 'viewer' && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>BECOME A CREATOR</Text>
              <View style={styles.creatorCard}>
                <Ionicons name="mic-outline" size={24} color={Colors.violet} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.creatorCardTitle}>Apply as a Creator</Text>
                  <Text style={styles.creatorCardSub}>Share your story. Reach audiences across Canada.</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
              </View>
            </View>
            <View style={styles.divider} />
          </>
        )}

        {/* CMF section for creators */}
        {(role === 'creator' || role === 'admin') && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CMF COMPLIANCE</Text>
              <View style={styles.cmfCard}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.emerald} />
                <Text style={styles.cmfText}>CAVCON Certified · French First-Class</Text>
              </View>
            </View>
            <View style={styles.divider} />
          </>
        )}

        {/* Sign out */}
        <View style={styles.section}>
          {!auth.isAuthenticated ? (
            <MenuItem
              icon="log-in-outline"
              label="Sign In"
              onPress={() => router.push('/onboarding')}
            />
          ) : (
            <MenuItem
              icon="log-out-outline"
              label="Sign Out"
              onPress={handleSignOut}
              danger
            />
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>SEEN by CREOVA · v1.0.0</Text>
          <Text style={styles.footerText}>CMF Compliant · PIPEDA Compliant</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 26, fontFamily: Colors.fontBold, color: Colors.textPrimary, letterSpacing: 1 },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontFamily: Colors.fontBold, color: Colors.textPrimary },
  userInfo: { flex: 1, gap: 4 },
  userName: { fontSize: 20, fontFamily: Colors.fontBold, color: Colors.textPrimary },
  userEmail: { fontSize: 13, fontFamily: Colors.fontRegular, color: Colors.textMuted },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Colors.radiusFull,
    borderWidth: 1,
    marginTop: 4,
  },
  roleText: { fontSize: 10, fontFamily: Colors.fontSemiBold, letterSpacing: 1.5 },
  statsRow: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 24, fontFamily: Colors.fontBold, color: Colors.textPrimary },
  statLabel: { fontSize: 11, fontFamily: Colors.fontRegular, color: Colors.textMuted, letterSpacing: 1 },
  divider: { height: 8, backgroundColor: Colors.surface, borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border },
  section: { paddingVertical: 8 },
  sectionTitle: {
    fontSize: 10,
    fontFamily: Colors.fontSemiBold,
    color: Colors.textMuted,
    letterSpacing: 3,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 14,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: Colors.fontMedium, color: Colors.textPrimary },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuValue: { fontSize: 13, fontFamily: Colors.fontRegular, color: Colors.textMuted },
  creatorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: Colors.violetDim,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: `${Colors.violet}33`,
  },
  creatorCardTitle: { fontSize: 15, fontFamily: Colors.fontSemiBold, color: Colors.textPrimary },
  creatorCardSub: { fontSize: 12, fontFamily: Colors.fontRegular, color: Colors.textSecondary, marginTop: 2 },
  cmfCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    padding: 14,
    backgroundColor: Colors.emeraldDim,
    borderRadius: Colors.radiusSm,
    borderWidth: 1,
    borderColor: `${Colors.emerald}33`,
  },
  cmfText: { fontSize: 13, fontFamily: Colors.fontMedium, color: Colors.emerald },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  footerText: { fontSize: 11, fontFamily: Colors.fontRegular, color: Colors.textMuted },
});
