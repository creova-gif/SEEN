import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';

const QUEUE_ITEMS = [
  {
    id: 'q1',
    title: 'Voices from Turtle Island',
    creator: 'Anishinaabe Collective',
    submittedAt: '2h ago',
    type: 'story',
    tags: ['indigenous', 'anishinaabe', 'oral-history'],
    description: 'A 4-chapter audio journey through traditional Anishinaabe land stewardship practices and their relevance to contemporary climate conversations.',
    language: ['en', 'ojibwe'],
    chapterCount: 4,
    duration: '38 min',
    flags: 0,
  },
  {
    id: 'q2',
    title: 'Little Burgundy Blues',
    creator: 'Marc-André Fontaine',
    submittedAt: '5h ago',
    type: 'music',
    tags: ['jazz', 'montreal', 'black-canadian'],
    description: 'Original compositions inspired by the jazz clubs of Montreal\'s Little Burgundy neighbourhood, historically the heart of Black Montreal.',
    language: ['fr', 'en'],
    chapterCount: 0,
    duration: '28 min',
    flags: 1,
  },
  {
    id: 'q3',
    title: 'Le Chemin du Retour',
    creator: 'Isabelle Morin',
    submittedAt: '1d ago',
    type: 'film',
    tags: ['francophone', 'acadian', 'identity'],
    description: 'A documentary short tracing the return of an Acadian family to their ancestral village in New Brunswick after three generations in Ontario.',
    language: ['fr'],
    chapterCount: 0,
    duration: '22 min',
    flags: 0,
  },
];

const AUDIT_LOG = [
  { id: 'a1', action: 'Approved', item: 'Roots in Niagara', by: 'Mod A', at: '1h ago', color: Colors.emerald },
  { id: 'a2', action: 'Rejected', item: 'Unnamed track', by: 'Mod B', at: '3h ago', color: Colors.red },
  { id: 'a3', action: 'Flagged', item: 'Street Canvases', by: 'Mod A', at: '6h ago', color: Colors.amber },
  { id: 'a4', action: 'Approved', item: 'Northern Echoes', by: 'Mod C', at: '1d ago', color: Colors.emerald },
];

const TABS = ['Queue', 'Audit', 'Guidelines'];

export default function QueueScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Queue');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [reviewed, setReviewed] = useState<string[]>([]);

  const pending = QUEUE_ITEMS.filter(i => !reviewed.includes(i.id));

  const approve = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setReviewed(prev => [...prev, id]);
  };

  const reject = (id: string) => {
    if (!rejectReason.trim()) {
      Alert.alert('Reason required', 'Please enter a reason for rejection.');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setReviewed(prev => [...prev, id]);
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.amber} />
          <Text style={styles.title}>Moderation Queue</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{pending.length}</Text>
        </View>
      </View>

      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {activeTab === 'Queue' && (
          <>
            {pending.length === 0 ? (
              <View style={styles.empty}>
                <Ionicons name="checkmark-circle-outline" size={48} color={Colors.emerald} />
                <Text style={styles.emptyTitle}>Queue clear</Text>
                <Text style={styles.emptySub}>All submissions have been reviewed.</Text>
              </View>
            ) : pending.map(item => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.cardMeta}>
                    <View style={styles.typeBadge}>
                      <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
                    </View>
                    {item.flags > 0 && (
                      <View style={styles.flagBadge}>
                        <Ionicons name="flag" size={10} color={Colors.red} />
                        <Text style={styles.flagText}>{item.flags} flag{item.flags !== 1 ? 's' : ''}</Text>
                      </View>
                    )}
                    <Text style={styles.timeAgo}>{item.submittedAt}</Text>
                  </View>
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardCreator}>{item.creator}</Text>

                <View style={styles.langRow}>
                  {item.language.map(lang => (
                    <View key={lang} style={styles.langPill}>
                      <Text style={styles.langText}>{lang.toUpperCase()}</Text>
                    </View>
                  ))}
                </View>

                <Text style={styles.cardDesc} numberOfLines={3}>{item.description}</Text>

                <View style={styles.tagRow}>
                  {item.tags.map(tag => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                {rejectingId === item.id ? (
                  <View style={styles.rejectForm}>
                    <Text style={styles.rejectLabel}>REASON FOR REJECTION</Text>
                    <TextInput
                      style={styles.rejectInput}
                      placeholder="Explain why this was rejected..."
                      placeholderTextColor={Colors.textMuted}
                      value={rejectReason}
                      onChangeText={setRejectReason}
                      multiline
                      numberOfLines={3}
                      autoFocus
                    />
                    <View style={styles.rejectActions}>
                      <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => { setRejectingId(null); setRejectReason(''); }}
                      >
                        <Text style={styles.cancelBtnText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.confirmRejectBtn} onPress={() => reject(item.id)}>
                        <Text style={styles.confirmRejectText}>Confirm Reject</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.actions}>
                    <TouchableOpacity style={styles.rejectBtn} onPress={() => setRejectingId(item.id)}>
                      <Ionicons name="close" size={16} color={Colors.red} />
                      <Text style={styles.rejectBtnText}>Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.flagBtn}>
                      <Ionicons name="flag-outline" size={16} color={Colors.amber} />
                      <Text style={styles.flagBtnText}>Flag</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.approveBtn} onPress={() => approve(item.id)}>
                      <Ionicons name="checkmark" size={16} color="#000" />
                      <Text style={styles.approveBtnText}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        {activeTab === 'Audit' && (
          <View style={styles.auditList}>
            {AUDIT_LOG.map(entry => (
              <View key={entry.id} style={styles.auditRow}>
                <View style={[styles.auditDot, { backgroundColor: entry.color }]} />
                <View style={styles.auditInfo}>
                  <Text style={styles.auditAction}>
                    <Text style={{ color: entry.color }}>{entry.action}</Text>
                    {' — '}{entry.item}
                  </Text>
                  <Text style={styles.auditMeta}>{entry.by} · {entry.at}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Guidelines' && (
          <View style={styles.guidelines}>
            {[
              { title: 'Cultural Authenticity', body: 'Content must be created by or in direct collaboration with the community it represents. Third-party interpretations require documented consent from community representatives.' },
              { title: 'Language Standards', body: 'Submissions in French must meet first-class quality standards per CMF requirements. Machine translation alone is not acceptable. Human review by a native speaker is required.' },
              { title: 'Historical Accuracy', body: 'All historical claims must be verifiable through cited sources. Contested histories must acknowledge multiple perspectives. Institutional partners must be contacted for archival content.' },
              { title: 'Safe Content', body: 'Content depicting trauma, violence, or sensitive cultural material must include appropriate content warnings. All stories involving residential school experiences require review by Indigenous moderators.' },
              { title: 'Privacy (PIPEDA)', body: 'Personal stories shared about living individuals require documented consent. Oral histories must have release forms on file. Children\'s voices or likenesses require parental consent.' },
            ].map(guide => (
              <View key={guide.title} style={styles.guideCard}>
                <Text style={styles.guideTitle}>{guide.title}</Text>
                <Text style={styles.guideBody}>{guide.body}</Text>
              </View>
            ))}
          </View>
        )}
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 18, fontFamily: Colors.fontBold, color: Colors.textPrimary, letterSpacing: 1 },
  badge: {
    backgroundColor: Colors.amber,
    borderRadius: 10,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: { fontSize: 12, fontFamily: Colors.fontBold, color: '#000' },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.amber },
  tabText: { fontSize: 13, fontFamily: Colors.fontMedium, color: Colors.textMuted },
  tabTextActive: { color: Colors.amber },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 14,
    gap: 10,
  },
  cardTop: {},
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typeBadge: {
    backgroundColor: Colors.amberDim,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  typeText: { fontSize: 9, fontFamily: Colors.fontSemiBold, color: Colors.amber, letterSpacing: 2 },
  flagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.redDim,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  flagText: { fontSize: 9, fontFamily: Colors.fontSemiBold, color: Colors.red, letterSpacing: 1 },
  timeAgo: { fontSize: 11, fontFamily: Colors.fontRegular, color: Colors.textMuted, marginLeft: 'auto' },
  cardTitle: { fontSize: 17, fontFamily: Colors.fontBold, color: Colors.textPrimary },
  cardCreator: { fontSize: 13, fontFamily: Colors.fontRegular, color: Colors.textSecondary },
  langRow: { flexDirection: 'row', gap: 6 },
  langPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  langText: { fontSize: 10, fontFamily: Colors.fontSemiBold, color: Colors.textMuted, letterSpacing: 1 },
  cardDesc: { fontSize: 13, fontFamily: Colors.fontRegular, color: Colors.textSecondary, lineHeight: 19 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: 'rgba(255,255,255,0.07)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 11, fontFamily: Colors.fontRegular, color: Colors.textMuted },
  actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Colors.radiusSm,
    borderWidth: 1,
    borderColor: `${Colors.red}44`,
    backgroundColor: Colors.redDim,
  },
  rejectBtnText: { fontSize: 13, fontFamily: Colors.fontSemiBold, color: Colors.red },
  flagBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Colors.radiusSm,
    borderWidth: 1,
    borderColor: `${Colors.amber}44`,
    backgroundColor: Colors.amberDim,
  },
  flagBtnText: { fontSize: 13, fontFamily: Colors.fontSemiBold, color: Colors.amber },
  approveBtn: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Colors.radiusSm,
    backgroundColor: Colors.emerald,
  },
  approveBtnText: { fontSize: 13, fontFamily: Colors.fontSemiBold, color: '#000' },
  rejectForm: { gap: 10 },
  rejectLabel: { fontSize: 10, fontFamily: Colors.fontSemiBold, color: Colors.textMuted, letterSpacing: 2 },
  rejectInput: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Colors.radiusSm,
    padding: 12,
    color: Colors.textPrimary,
    fontFamily: Colors.fontRegular,
    fontSize: 13,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  rejectActions: { flexDirection: 'row', gap: 8 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Colors.radiusSm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: { fontSize: 13, fontFamily: Colors.fontSemiBold, color: Colors.textSecondary },
  confirmRejectBtn: {
    flex: 1.5,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Colors.radiusSm,
    backgroundColor: Colors.red,
  },
  confirmRejectText: { fontSize: 13, fontFamily: Colors.fontSemiBold, color: '#fff' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 14 },
  emptyTitle: { fontSize: 20, fontFamily: Colors.fontSemiBold, color: Colors.textSecondary },
  emptySub: { fontSize: 14, fontFamily: Colors.fontRegular, color: Colors.textMuted, textAlign: 'center' },
  auditList: { gap: 1 },
  auditRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  auditDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  auditInfo: { flex: 1, gap: 4 },
  auditAction: { fontSize: 14, fontFamily: Colors.fontSemiBold, color: Colors.textPrimary },
  auditMeta: { fontSize: 12, fontFamily: Colors.fontRegular, color: Colors.textMuted },
  guidelines: { gap: 12 },
  guideCard: {
    backgroundColor: Colors.surface,
    borderRadius: Colors.radius,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 8,
  },
  guideTitle: { fontSize: 15, fontFamily: Colors.fontSemiBold, color: Colors.textPrimary },
  guideBody: { fontSize: 13, fontFamily: Colors.fontRegular, color: Colors.textSecondary, lineHeight: 19 },
});
