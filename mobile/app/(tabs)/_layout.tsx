import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text, Platform } from 'react-native';
import { colors, typography, layout } from '../../constants/theme';
import { Header } from '../../components/Header';

// Active-icon glow matching the zip's `drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`.
// On web we can use CSS filter; on native we fall back to white text-shadow on the icon glyph.
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
  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarStyle: styles.tabBar,
        tabBarLabelPosition: 'below-icon',
        tabBarItemStyle: { paddingTop: 8, maxWidth: layout.containerMaxWidth / 4 },
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
        name="library"
        options={{
          title: 'Library',
          tabBarAccessibilityLabel: 'Library tab',
          tabBarIcon: ({ focused }) => <TabIcon name="bookmark-outline" focused={focused} />,
          tabBarLabel: ({ focused }) => <TabLabel label="Library" focused={focused} />,
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
