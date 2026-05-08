import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { STORY_CONTENT } from '../../data/database';

const TABS = [
  { id: 'progress', label: 'In Progress', icon: 'play-circle-outline' as const, color: Colors.amber },
  { id: 'completed', label: 'Completed', icon: 'checkmark-circle-outline' as const, color: Colors.emerald },
  { id: 'collections', label: 'Collections', icon: 'bookmark-outline' as const, color: Colors.violet },
  { id: 'downloads', label: 'Downloads', icon: 'download-outline' as const, color: Colors.blue },
];

const IN_PROGRESS = STORY_CONTENT.slice(0, 3).map((s, i) => ({
  ...s,
  progress: [35, 68, 12][i],
  lastChapter: ['Ch. 2 — Underground Harmonies', 'Ch. 3 — The Last Spike', 'Ch. 1 — The River'][i],
}));

const COMPLETED = STORY_CONTENT.slice(3, 5);

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('progress');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.subtitle}>Your personal collection</Text>
      </View>

      {/* Stat tabs */}
      <View style={styles.tabRow}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, active && { borderBottomColor: tab.color }]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Ionicons name={tab.icon} size={16} color={active ? tab.color : Colors.textMuted} />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.tabLabelRow}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <TouchableOpacity key={tab.id} style={styles.tabLabel} onPress={() => setActiveTab(tab.id)}>
              <Text style={[styles.tabLabelText, active && { color: Colors.textPrimary }]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {activeTab === 'progress' && (
          <View style={styles.list}>
            {IN_PROGRESS.length === 0 ? (
              <EmptyState icon="play-circle-outline" title="Nothing in progress" sub="Start a story to see it here" />
            ) : IN_PROGRESS.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => router.push({ pathname: '/story/[id]', params: { id: item.id } })}
                activeOpacity={0.75}
              >
                <Image source={{ uri: item.mediaSource }} style={styles.cardThumb} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.cardMeta}>{item.lastChapter}</Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{item.progress}% complete</Text>
                </View>
                <TouchableOpacity style={styles.resumeBtn}>
                  <Ionicons name="play" size={14} color="#000" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'completed' && (
          <View style={styles.list}>
            {COMPLETED.length === 0 ? (
              <EmptyState icon="checkmark-circle-outline" title="No completed stories" sub="Finish a story to see it here" />
            ) : COMPLETED.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() => router.push({ pathname: '/story/[id]', params: { id: item.id } })}
                activeOpacity={0.75}
              >
                <Image source={{ uri: item.mediaSource }} style={styles.cardThumb} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.cardMeta}>{item.creator} · {item.duration}</Text>
                  <View style={[styles.progressTrack, { marginTop: 8 }]}>
                    <View style={[styles.progressFill, { width: '100%', backgroundColor: Colors.emerald }]} />
                  </View>
                </View>
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={22} color={Colors.emerald} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 'collections' && (
          <View style={styles.list}>
            <EmptyState
              icon="bookmark-outline"
              title="No collections yet"
              sub="Save stories to a collection while browsing"
            />
          </View>
        )}

        {activeTab === 'downloads' && (
          <View style={styles.list}>
            <EmptyState
              icon="download-outline"
              title="No offline downloads"
              sub="Download stories to listen without internet"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function EmptyState({ icon, title, sub }: { icon: any; title: string; sub: string }) {
  return (
    <View style={emptyStyles.container}>
      <Ionicons name={icon} size={44} color={Colors.textMuted} />
      <Text style={emptyStyles.title}>{title}</Text>
      <Text style={emptyStyles.sub}>{sub}</Text>
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  title: { fontSize: 18, fontFamily: Colors.fontSemiBold, color: Colors.textSecondary },
  sub: { fontSize: 14, fontFamily: Colors.fontRegular, color: Colors.textMuted, textAlign: 'center' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 26, fontFamily: Colors.fontBold, color: Colors.textPrimary, letterSpacing: 1 },
  subtitle: { fontSize: 11, fontFamily: Colors.fontRegular, color: Colors.textMuted, letterSpacing: 2, marginTop: 2 },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabLabelRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabLabel: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  tabLabelText: { fontSize: 10, fontFamily: Colors.fontMedium, color: Colors.textMuted, letterSpacing: 0.5 },
  list: { padding: 16, gap: 2 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cardThumb: {
    width: 72,
    height: 72,
    borderRadius: Colors.radiusSm,
    backgroundColor: Colors.surface,
    flexShrink: 0,
  },
  cardInfo: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 15, fontFamily: Colors.fontSemiBold, color: Colors.textPrimary },
  cardMeta: { fontSize: 12, fontFamily: Colors.fontRegular, color: Colors.textMuted },
  progressTrack: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.amber, borderRadius: 2 },
  progressText: { fontSize: 11, fontFamily: Colors.fontRegular, color: Colors.textMuted },
  resumeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedBadge: { width: 36, alignItems: 'center' },
});
