import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Audio, ResizeMode, Video } from 'expo-av';
import type { Temple, UiStrings } from '@temple/core';
import { radius, useTheme } from '@/lib/theme';

function clock(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// Narrated-story card: streams the temple's TTS narration with a simple
// play/pause control. Nothing loads until the devotee taps play, keeping the
// screen cheap on 4G; the page prose remains the accessible transcript.
export function AudioStoryCard({ temple, ui }: { temple: Temple; ui: UiStrings }) {
  const { colors } = useTheme();
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState((temple.audio?.durationSec ?? 0) * 1000);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
      soundRef.current = null;
    };
  }, []);

  if (!temple.audio) {
    return (
      <View
        style={{
          borderColor: colors.line,
          borderWidth: 0.5,
          borderStyle: 'dashed',
          borderRadius: radius.card,
          padding: 16,
          marginTop: 18,
        }}
      >
        <Text style={{ color: colors.inkStrong, fontWeight: '600', marginBottom: 4 }}>
          ♪ {ui.tabs.listen}
        </Text>
        <Text style={{ color: colors.inkMuted, fontSize: 14 }}>
          {ui.labels.listenComingSoon}
        </Text>
      </View>
    );
  }

  async function toggle() {
    if (busy) return;
    try {
      setBusy(true);
      if (!soundRef.current) {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(
          { uri: temple.audio!.storyUrl },
          { shouldPlay: true },
          (status) => {
            if (!status.isLoaded) return;
            setPlaying(status.isPlaying);
            setPosition(status.positionMillis);
            if (status.durationMillis) setDuration(status.durationMillis);
            if (status.didJustFinish) sound.setPositionAsync(0);
          }
        );
        soundRef.current = sound;
      } else if (playing) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <View
      style={{
        backgroundColor: colors.bgRaised,
        borderColor: colors.line,
        borderWidth: 0.5,
        borderRadius: radius.card,
        padding: 16,
        marginTop: 18,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={ui.tabs.listen}
        style={({ pressed }) => ({
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: colors.accentVermilion,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: pressed || busy ? 0.7 : 1,
          marginRight: 14,
        })}
      >
        <Text style={{ color: '#fff', fontSize: 20 }}>{playing ? '❚❚' : '▶'}</Text>
      </Pressable>
      <View style={{ flexShrink: 1 }}>
        <Text style={{ color: colors.inkStrong, fontWeight: '600' }}>
          ♪ {ui.tabs.listen}
        </Text>
        <Text style={{ color: colors.inkMuted, fontSize: 14, marginTop: 2 }}>
          {clock(position)} / {clock(duration)}
        </Text>
      </View>
    </View>
  );
}

// Narrated-video card: the story told over real photographs. Poster is the
// already-cached hero photo; the video streams only on demand.
export function VideoStoryCard({ temple, ui }: { temple: Temple; ui: UiStrings }) {
  const { colors } = useTheme();
  if (!temple.video) return null;
  return (
    <View
      style={{
        backgroundColor: colors.bgRaised,
        borderColor: colors.line,
        borderWidth: 0.5,
        borderRadius: radius.card,
        padding: 16,
        marginTop: 18,
      }}
    >
      <Text style={{ color: colors.inkStrong, fontWeight: '600', marginBottom: 10 }}>
        ▶ {ui.labels.videoStory}
      </Text>
      <Video
        source={{ uri: temple.video.url }}
        usePoster={!!temple.video.posterUrl}
        posterSource={temple.video.posterUrl ? { uri: temple.video.posterUrl } : undefined}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        style={{
          width: '100%',
          aspectRatio: 16 / 9,
          borderRadius: 8,
          backgroundColor: '#000',
        }}
      />
      {temple.video.credit && (
        <Text style={{ color: colors.inkMuted, fontSize: 12, marginTop: 8 }}>
          {temple.video.credit}
        </Text>
      )}
    </View>
  );
}
