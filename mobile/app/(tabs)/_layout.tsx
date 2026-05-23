import { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, layout } from '../../constants/theme';
import { Header } from '../../components/Header';

type Role = 'viewer' | 'creator' | 'moderator';

// Active-icon glow matching the zip's `drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`.
const activeGlow =
  Platform.OS === 'web'
    ? ({ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' } as any)
    : {
        textShadowColor: 'rgba(255,255,255,0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
      };

function TabIcon({ name, focused }: { name: keyof typeof Ionicons.glyphMap; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: 24 }}>
      <Ionicons
        name={name}
        size={20}
        color={focused ? colors.textPrimary : colors.textFaint}
        style={focused ? activeGlow : undefined}
      />
    </View>
  );
}

// Special centered "+" Create tab icon for creators — raised circle, glowing.
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
        shadowColor: '#fff',
        shadowOpacity: focused ? 0.45 : 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 0 },
      }}
    >
      <Ionicons name="add" size={26} color="#000" />
    </View>
  );
}

function TabLabel({ label, focused }: { label: string; focused: boolean }) {
  return (
    <Text
      style={{
        fontSize: 9,
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontWeight: focused ? '500' : '400',
        color: focused ? colors.textPrimary : colors.textFaint,
        marginTop: 4,
      }}
    >
      {label}
    </Text>
  );
}

export default function TabsLayout() {
  // Read role on mount; default to viewer until storage resolves.
  const [role, setRole] = useState<Role>('viewer');
  useEffect(() => {
    AsyncStorage.getItem('seen_role')
      .then((r) => {
        if (r === 'creator' || r === 'moderator') setRole(r);
      })
      .catch(() => {});
  }, []);

  const showCreate = role === 'creator';
  const showModerate = role === 'moderator';

  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarStyle: styles.tabBar,
        tabBarLabelPosition: 'below-icon',
        tabBarItemStyle: { paddingTop: 8 },
        tabBarActiveTintColor: colors.textPrimary,
        tabBarInactiveTintColor: colors.textFaint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'For You',
          tabBarAccessibilityLabel: 'For You tab',
          tabBarIcon: ({ focused }) => <TabIcon name="sparkles-outline" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="For You" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarAccessibilityLabel: 'Explore tab',
          tabBarIcon: ({ focused }) => <TabIcon name="compass-outline" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Explore" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          // Hide entirely for non-creators
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
          tabBarIcon: ({ focused }) => <TabIcon name="bookmark-outline" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Library" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="moderate"
        options={{
          title: 'Queue',
          href: showModerate ? undefined : null,
          tabBarAccessibilityLabel: 'Moderation queue tab',
          tabBarIcon: ({ focused }) => <TabIcon name="shield-checkmark-outline" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Queue" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarAccessibilityLabel: 'Profile tab',
          tabBarIcon: ({ focused }) => <TabIcon name="person-outline" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderTopColor: colors.borderSubtle,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 78,
    paddingBottom: 18,
    paddingTop: 0,
  },
});
