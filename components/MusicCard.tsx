import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import type { ContentItem } from '../data/types';

interface Props {
  item: ContentItem;
}

export function MusicCard({ item }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/story/[id]', params: { id: item.id } })}
      activeOpacity={0.75}
    >
      <Image source={{ uri: item.mediaSource }} style={styles.image} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.85)']}
        style={styles.gradient}
      >
        <View style={styles.playBtn}>
          <Ionicons name="play" size={14} color="#000" />
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.meta}>{item.duration}</Text>
      </LinearGradient>
      {item.new && (
        <View style={styles.newBadge}>
          <Text style={styles.newText}>NEW</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 148,
    height: 148,
    borderRadius: Colors.radius,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: Colors.surface,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    paddingTop: 24,
    gap: 2,
  },
  playBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 12,
    fontFamily: Colors.fontSemiBold,
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  meta: {
    fontSize: 10,
    fontFamily: Colors.fontRegular,
    color: Colors.textSecondary,
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.amber,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newText: {
    fontSize: 8,
    fontFamily: Colors.fontBold,
    color: '#000',
    letterSpacing: 1,
  },
});
