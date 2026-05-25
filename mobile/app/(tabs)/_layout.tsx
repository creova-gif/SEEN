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
      style={[
        {
          fontSize: 10,
          lineHeight: 14,
          letterSpacing: 2,
          textTransform: 'uppercase',
          fontWeight: focused ? '500' : '300',
          color: focused ? colors.textPrimary : colors.textFaint,
          opacity: focused ? 1 : 0.4,
          marginTop: 4,
          paddingBottom: 2,
          // Offset trailing letterSpacing so the text optically centers under the icon.
          paddingLeft: 2,
          textAlign: 'center',
          includeFontPadding: false,
        },
        // Suppress browser default text decoration / focus underline that bleeds
        // through the active tab's <a> wrapper in the web preview only.
        Platform.OS === 'web' && ({ textDecorationLine: 'none' } as any),
      ]}
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
        tabBarItemStyle: [
          { paddingTop: 8, paddingBottom: 12 },
          // Kill the browser focus ring and link underline on web so the active
          // tab doesn't show a tiny dash under the label.
          Platform.OS === 'web' && ({ outlineStyle: 'none', textDecorationLine: 'none' } as any),
        ] as any,
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
    // Native safe-area bottom is added by react-navigation automatically on iOS.
    // Keep the bar tall enough that icon (20) + gap (6) + label (~14) fits with breathing room.
    height: Platform.OS === 'web' ? 88 : 96,
    paddingBottom: Platform.OS === 'web' ? 12 : 24,
    paddingTop: 0,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
    width: 40,
  },
});
