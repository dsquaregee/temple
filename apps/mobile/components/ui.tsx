import { type ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { radius, useTheme, fonts } from '@/lib/theme';

export function Screen({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.safe, { backgroundColor: colors.bgBase }]}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Title({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.title, { color: colors.inkStrong }]}>{children}</Text>
  );
}

export function NativeName({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.native, { color: colors.accentVermilion }]}>
      {children}
    </Text>
  );
}

export function Muted({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return <Text style={[styles.muted, { color: colors.inkMuted }]}>{children}</Text>;
}

export function SectionHeading({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return (
    <Text
      style={[
        styles.sectionHeading,
        { color: colors.inkStrong, borderBottomColor: colors.line },
      ]}
    >
      {children}
    </Text>
  );
}

export function Body({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return <Text style={[styles.body, { color: colors.inkBody }]}>{children}</Text>;
}

export function Lead({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return <Text style={[styles.lead, { color: colors.inkStrong }]}>{children}</Text>;
}

export function Chip({ children, accent }: { children: ReactNode; accent?: boolean }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: accent ? 'transparent' : colors.bgSunken,
          borderColor: accent ? colors.accentTurmeric : colors.line,
        },
      ]}
    >
      <Text
        style={{
          color: accent ? colors.accentTurmeric : colors.inkBody,
          fontSize: 12,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

export function Card({
  children,
  onPress,
}: {
  children: ReactNode;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.bgRaised,
          borderColor: colors.line,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      {children}
    </Pressable>
  );
}

export function Hero({
  children,
  color,
}: {
  children: ReactNode;
  color?: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={[styles.hero, { backgroundColor: color ?? colors.accentVermilion }]}>
      {children}
    </View>
  );
}

export function Tile({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.tile, { backgroundColor: colors.bgSunken }]}>
      <Text style={[styles.tileK, { color: colors.inkMuted }]}>{label}</Text>
      <Text style={[styles.tileV, { color: colors.inkBody }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 32 },
  title: { fontFamily: fonts.display, fontSize: 28, fontWeight: '700', marginBottom: 4 },
  native: { fontFamily: fonts.display, fontSize: 16, marginBottom: 8 },
  muted: { fontSize: 14 },
  sectionHeading: {
    fontFamily: fonts.display,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  body: { fontSize: 16, lineHeight: 25 },
  lead: { fontFamily: fonts.display, fontSize: 19, lineHeight: 28 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.chip,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 6,
    marginBottom: 6,
  },
  card: {
    borderRadius: radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 12,
  },
  hero: {
    borderRadius: radius.card,
    padding: 22,
    marginBottom: 20,
    minHeight: 150,
    justifyContent: 'flex-end',
  },
  tile: { borderRadius: radius.card, padding: 14, marginBottom: 10 },
  tileK: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tileV: { fontSize: 15 },
});
