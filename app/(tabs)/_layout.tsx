import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { useStoryState } from '../../contexts/StoryStateContext';
import type { ComponentProps } from 'react';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

interface TabIconProps {
  name: IoniconName;
  label: string;
  focused: boolean;
  badge?: number;
  accentColor?: string;
}

function TabIcon({ name, label, focused, badge, accentColor }: TabIconProps) {
  const color = focused ? (accentColor ?? Colors.amber) : Colors.textMuted;
  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.iconWrap}>
        <Ionicons name={focused ? name.replace('-outline', '') as IoniconName : name} size={22} color={color} />
        {badge != null && badge > 0 && (
          <View style={tabStyles.badge}>
            <Text style={tabStyles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        )}
      </View>
      <Text style={[tabStyles.label, { color }]}>{label}</Text>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: { alignItems: 'center', gap: 3, paddingTop: 6 },
  iconWrap: { position: 'relative' },
  label: { fontSize: 10, fontFamily: Colors.fontMedium, letterSpacing: 0.5 },
  badge: {
    position: 'absolute', top: -4, right: -8,
    backgroundColor: Colors.amber, borderRadius: 8,
    minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { fontSize: 9, fontFamily: Colors.fontBold, color: '#000' },
});

export default function TabsLayout() {
  const { state } = useStoryState();
  const insets = useSafeAreaInsets();
  const isMod = state.userRole === 'moderator' || state.userRole === 'admin';
  const isCreator = state.userRole === 'creator' || state.userRole === 'admin';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 56 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="home-outline" label="For You" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="compass-outline" label="Explore" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="library-outline" label="Library" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="queue"
        options={{
          href: isMod ? undefined : null,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name="shield-outline"
              label="Queue"
              focused={focused}
              accentColor={Colors.amber}
              badge={3}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="person-outline" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
