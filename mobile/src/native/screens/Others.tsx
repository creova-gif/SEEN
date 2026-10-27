import { useNavigation } from '@react-navigation/native';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPublicStories, t, type Language } from '../data';
import { useApp } from '../storage';
import { c, font, gutter, space } from '../theme';
import { Button, Chip } from '../ui';
import { StoryCard } from './ForYou';

export function Library() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { saved, lang } = useApp();
  const stories = getPublicStories().filter(s => saved.includes(s.id));
  return (
    <View style={{ flex: 1, backgroundColor: c.canvas, paddingTop: insets.top }}>
      <FlatList
        data={stories}
        numColumns={2}
        keyExtractor={s => s.id}
        columnWrapperStyle={{ gap: space.md, paddingHorizontal: gutter, marginBottom: space.lg }}
        ListHeaderComponent={<Text style={styles.h1}>{t('nav.library', lang)}</Text>}
        renderItem={({ item }) => <View style={{ flex: 1 }}><StoryCard story={item} wide onPress={() => nav.navigate('Story', { id: item.id })} /></View>}
        ListEmptyComponent={<Text style={styles.empty}>{t('native.libraryEmpty', lang)}</Text>}
      />
    </View>
  );
}

export function Profile() {
  const insets = useSafeAreaInsets();
  const nav = useNavigation<any>();
  const { lang, setLang, user, signOut } = useApp();
  const langs: [Language, string][] = [['en', 'English'], ['fr', 'Français'], ['es', 'Español']];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: c.canvas }} contentContainerStyle={{ paddingTop: insets.top, paddingBottom: space.xxl }}>
      <Text style={styles.h1}>{t('nav.profile', lang)}</Text>
      <Text style={styles.h2}>{t('native.language', lang)}</Text>
      <Text style={styles.note}>{t('native.languageHint', lang)}</Text>
      <View style={styles.chips}>
        {langs.map(([code, name]) => <Chip key={code} label={name} selected={lang === code} onPress={() => setLang(code)} />)}
      </View>
      <Text style={styles.h2}>{t('native.account', lang)}</Text>
      {user ? (
        <>
          <Text style={styles.note}>{t('native.acct.signedInAs', lang, { name: user.name })}</Text>
          <View style={{ marginHorizontal: gutter, marginTop: space.lg, alignSelf: 'flex-start' }}><Button label={t('native.acct.signout', lang)} variant="secondary" onPress={signOut} /></View>
        </>
      ) : (
        <>
          <Text style={styles.note}>{t('guest.banner', lang)}</Text>
          <View style={{ marginHorizontal: gutter, marginTop: space.lg, alignSelf: 'flex-start' }}><Button label={t('guest.cta.create', lang)} onPress={() => nav.navigate('Account', { mode: 'signup' })} /></View>
        </>
      )}
      <Text style={styles.note}>{t('native.acct.local', lang)}</Text>
    </ScrollView>
  );
}

export function CreateIntro() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { lang } = useApp();
  return (
    <View style={{ flex: 1, backgroundColor: c.canvas, padding: gutter, paddingTop: insets.top + space.xl }}>
      <Text style={styles.eyebrow}>{t('creator.intro.eyebrow', lang)}</Text>
      <Text style={styles.h1b}>{t('creator.intro.title', lang)}</Text>
      <Text style={styles.note}>{t('creator.intro.body', lang)}</Text>
      <Text style={[styles.note, { marginTop: space.lg }]}>{t('native.createSoon', lang)}</Text>
      <Button label={t('creator.intro.later', lang)} variant="secondary" onPress={() => nav.goBack()} style={{ marginTop: space.xl }} />
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { color: c.text, fontFamily: font.display, fontSize: 34, marginHorizontal: gutter, marginTop: space.lg, marginBottom: space.lg },
  h1b: { color: c.text, fontFamily: font.display, fontSize: 32, marginTop: space.sm, marginBottom: space.md },
  h2: { color: c.text, fontSize: 17, fontWeight: '600', marginHorizontal: gutter, marginTop: space.xl },
  note: { color: c.secondary, fontSize: 15, lineHeight: 22, marginHorizontal: gutter, marginTop: space.sm },
  eyebrow: { color: c.accent, fontSize: 11, letterSpacing: 1.6, textTransform: 'uppercase' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginHorizontal: gutter, marginTop: space.md },
  empty: { color: c.muted, textAlign: 'center', marginTop: space.xxl, marginHorizontal: gutter },
});
