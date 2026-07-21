import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { router } from 'expo-router';
import {
  buildPlaylist,
  formatTime,
  stepIndex,
  type Locale,
  type Temple,
  type UiStrings,
} from '@temple/core';
import { radius, useTheme } from '@/lib/theme';
import { Card, NativeName, Title } from '@/components/ui';

// The Listen tab as a player (parity with the web ListenPlayer). Narrated
// temples form a playlist: tapping one streams its narration in a bottom
// now-playing bar, prev/next step through the set (wrapping, auto-advancing on
// finish). Nothing loads until the first tap — cheap on 4G. The temple page
// prose remains the accessible transcript.
export function ListenPlayer({
  locale,
  ui,
  temples,
}: {
  locale: Locale;
  ui: UiStrings;
  temples: Temple[];
}) {
  const { colors } = useTheme();
  const { ready, upcoming } = buildPlaylist(temples);

  const [index, setIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [position, setPosition] = useState(0); // ms
  const [duration, setDuration] = useState(0); // ms
  const soundRef = useRef<Audio.Sound | null>(null);
  // Latest "advance" fn, so the playback-status callback never fires a stale one.
  const advanceRef = useRef<() => void>(() => {});

  const current = index == null ? null : ready[index] ?? null;

  useEffect(() => {
    return () => {
      void soundRef.current?.unloadAsync();
      soundRef.current = null;
    };
  }, []);

  const loadAndPlay = useCallback(
    async (i: number) => {
      if (busy) return;
      const temple = ready[i];
      if (!temple?.audio) return;
      setBusy(true);
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        setIndex(i);
        setPosition(0);
        setDuration((temple.audio.durationSec ?? 0) * 1000);
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(
          { uri: temple.audio.storyUrl },
          { shouldPlay: true },
          (status) => {
            if (!status.isLoaded) return;
            setPlaying(status.isPlaying);
            setPosition(status.positionMillis);
            if (status.durationMillis) setDuration(status.durationMillis);
            if (status.didJustFinish) advanceRef.current();
          },
        );
        soundRef.current = sound;
      } finally {
        setBusy(false);
      }
    },
    [busy, ready],
  );

  const step = useCallback(
    (delta: number) => {
      if (index == null || ready.length === 0) return;
      void loadAndPlay(stepIndex(index, delta, ready.length));
    },
    [index, ready.length, loadAndPlay],
  );

  useEffect(() => {
    advanceRef.current = () => step(1);
  }, [step]);

  const toggle = useCallback(async () => {
    if (busy || !soundRef.current) return;
    if (playing) await soundRef.current.pauseAsync();
    else await soundRef.current.playAsync();
  }, [busy, playing]);

  const onCardPress = (i: number) => {
    if (index === i) void toggle();
    else void loadAndPlay(i);
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.bgBase }]}>
      <View style={styles.fill}>
        <ScrollView
          contentContainerStyle={[styles.scroll, current ? styles.scrollWithBar : null]}
          showsVerticalScrollIndicator={false}
        >
          <Title>{ui.tabs.listen}</Title>

          {ready.length === 0 && (
            <View
              style={{
                borderColor: colors.line,
                borderWidth: StyleSheet.hairlineWidth,
                borderStyle: 'dashed',
                borderRadius: radius.card,
                padding: 16,
                marginVertical: 12,
              }}
            >
              <Text style={{ color: colors.inkStrong, fontWeight: '600', marginBottom: 4 }}>
                ♪ {ui.tabs.listen}
              </Text>
              <Text style={{ color: colors.inkMuted, fontSize: 14 }}>
                {ui.labels.listenComingSoon}
              </Text>
            </View>
          )}

          {ready.map((tp, i) => {
            const active = index === i;
            return (
              <Card key={tp.id} onPress={() => onCardPress(i)}>
                <View style={styles.row}>
                  <View style={{ flexShrink: 1 }}>
                    <Text style={{ color: colors.inkStrong, fontSize: 18, fontWeight: '600' }}>
                      {tp.name}
                    </Text>
                    <NativeName>{tp.nativeName}</NativeName>
                  </View>
                  <Text
                    accessibilityLabel={`${active && playing ? ui.listen.pause : ui.listen.play}: ${tp.name}`}
                    style={{ color: colors.accentLeaf, fontSize: 16 }}
                  >
                    {active && playing ? '❚❚' : '▶'}
                  </Text>
                </View>
              </Card>
            );
          })}

          {upcoming.map((tp) => (
            <Card key={tp.id} onPress={() => router.push(`/${locale}/temples/${tp.id}`)}>
              <View style={styles.row}>
                <View style={{ flexShrink: 1 }}>
                  <Text style={{ color: colors.inkStrong, fontSize: 18, fontWeight: '600' }}>
                    {tp.name}
                  </Text>
                  <NativeName>{tp.nativeName}</NativeName>
                </View>
                <Text style={{ color: colors.inkMuted, fontSize: 16 }}>···</Text>
              </View>
            </Card>
          ))}

          <View style={{ height: 8 }} />
        </ScrollView>

        {current && (
          <View
            style={[
              styles.bar,
              { backgroundColor: colors.bgRaised, borderTopColor: colors.line },
            ]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={playing ? ui.listen.pause : ui.listen.play}
              onPress={() => void toggle()}
              style={({ pressed }) => [
                styles.playBtn,
                { backgroundColor: colors.accentLeaf, opacity: pressed || busy ? 0.7 : 1 },
              ]}
            >
              <Text style={{ color: '#fff', fontSize: 18 }}>{playing ? '❚❚' : '▶'}</Text>
            </Pressable>

            <Pressable
              style={styles.barTitle}
              accessibilityRole="link"
              accessibilityLabel={`${ui.listen.readStory}: ${current.name}`}
              onPress={() => router.push(`/${locale}/temples/${current.id}`)}
            >
              <Text style={{ color: colors.inkMuted, fontSize: 11 }}>{ui.listen.nowPlaying}</Text>
              <Text numberOfLines={1} style={{ color: colors.inkStrong, fontWeight: '600' }}>
                {current.name}
              </Text>
              <Text style={{ color: colors.inkMuted, fontSize: 12 }}>
                {formatTime(position / 1000)} / {formatTime(duration / 1000)}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={ui.listen.previous}
              disabled={ready.length < 2}
              onPress={() => step(-1)}
              style={styles.stepBtn}
            >
              <Text style={{ color: ready.length < 2 ? colors.inkMuted : colors.inkStrong, fontSize: 18 }}>
                ⏮
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={ui.listen.next}
              disabled={ready.length < 2}
              onPress={() => step(1)}
              style={styles.stepBtn}
            >
              <Text style={{ color: ready.length < 2 ? colors.inkMuted : colors.inkStrong, fontSize: 18 }}>
                ⏭
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  fill: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  scrollWithBar: { paddingBottom: 96 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  playBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barTitle: { flex: 1, minWidth: 0, justifyContent: 'center' },
  stepBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
