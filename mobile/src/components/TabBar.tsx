import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

export type Tab = 'home' | 'profile';

interface TabBarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const TABS: { key: Tab; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'home', label: 'For You', icon: 'home' },
  { key: 'profile', label: 'Profile', icon: 'person' },
];

export function TabBar({ active, onChange }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
      {TABS.map(tab => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
          >
            <Ionicons
              name={isActive ? tab.icon : (`${tab.icon}-outline` as keyof typeof Ionicons.glyphMap)}
              size={22}
              color={isActive ? colors.white : 'rgba(255,255,255,0.4)'}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.92)',
    borderTopWidth: 1,
    borderTopColor: colors.whiteFaint,
    paddingTop: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.4)',
  },
  labelActive: {
    color: colors.white,
  },
});
