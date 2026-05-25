import { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Home, Compass, Library as LibraryIcon, User, Plus, ShieldCheck } from 'lucide-react-native';
import { StyleSheet, View, Text, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../utils/supabase';
import { colors } from '../../constants/theme';
import { Header } from '../../components/Header';

type Role = 'viewer' | 'creator' | 'moderator';

// Active-icon glow matching the zip's `drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`.
const activeGlowStyle =
  Platform.OS === 'web'
    ? ({ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' } as any)
    : undefined;

function TabIcon({
  Icon,
  focused,
}: {
  Icon: typeof Home;
  focused: boolean;
}) {
  return (
    <View style={styles.iconWrap}>
      {/* Active indicator: 32x2 white rounded line at the TOP of the tab item, above the icon. */}
      {focused && <View style={styles.activeIndicator} />}
      <Icon
        size={20}
        color={focused ? colors.textPrimary : colors.textFaint}
        strokeWidth={focused ? 2 : 1.5}
        style={focused ? activeGlowStyle : undefined}
      />
    </View>
  );
}

// Creator-only raised "+" tab — kept per role-based architecture.
function CreateTabIcon({ focused }: { focused: boolean }) {
  return (
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: focused ? '#fff' : 'rgba(255,255,255,0.92)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -10,
      }}
    >
      <Plus size={22} color="#000" strokeWidth={2.5} />
    </View>
  );
}

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      numberOfLines={1}
      allowFontScaling={false}
      style={{
        fontSize: 10,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontWeight: focused ? '500' : '300',
        color: focused ? colors.textPrimary : colors.textFaint,
        opacity: focused ? 1 : 0.4,
        marginTop: 6,
        // Offset trailing letterSpacing so the text optically centers under the icon.
        paddingLeft: 2,
        textAlign: 'center',
      }}
    >
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  const [role, setRole] = useState<Role>('viewer');
  useEffect(() => {
    const fetchRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.role) {
        const r = session.user.user_metadata.role;
        if (r === 'creator' || r === 'moderator') setRole(r);
        return;
      }
      try {
        const r = await AsyncStorage.getItem('seen_role');
        if (r === 'creator' || r === 'moderator') setRole(r as Role);
      } catch {}
    };
    fetchRole();
  }, []);

  const showCreate = role === 'creator';
  const showModerate = role === 'moderator';

  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarStyle: styles.tabBar,
        tabBarLabelPosition: 'below-icon',
        tabBarItemStyle: { paddingTop: 10 },
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textFaint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'For You',
          tabBarAccessibilityLabel: 'For You tab',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Home} focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="For You" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarAccessibilityLabel: 'Explore tab',
          tabBarIcon: ({ focused }) => <TabIcon Icon={Compass} focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Explore" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          href: showCreate ? undefined : null,
          tabBarAccessibilityLabel: 'Create tab',
          tabBarIcon: ({ focused }) => <CreateTabIcon focused={focused} />,
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarAccessibilityLabel: 'Library tab',
          tabBarIcon: ({ focused }) => <TabIcon Icon={LibraryIcon} focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Library" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="moderate"
        options={{
          title: 'Queue',
          href: showModerate ? undefined : null,
          tabBarAccessibilityLabel: 'Moderation queue tab',
          tabBarIcon: ({ focused }) => <TabIcon Icon={ShieldCheck} focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Queue" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarAccessibilityLabel: 'Profile tab',
          tabBarIcon: ({ focused }) => <TabIcon Icon={User} focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderTopColor: 'rgba(255,255,255,0.1)',
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 84,
    paddingBottom: 22,
    paddingTop: 0,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    width: 40,
  },
  activeIndicator: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -16,
    width: 32,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#fff',
  },
});
