import { useMemo, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  ERAS,
  SORTS,
  filterTemples,
  regionsOf,
  searchIndexText,
  sortTemples,
  t,
  type Era,
  type SortKey,
} from '@temple/core';
import { getCircuits, getTemples } from '@temple/content';
import { asLocale } from '@/lib/locale';
import { MIN_TOUCH, radius, useTheme } from '@/lib/theme';
import { Card, Muted, NativeName, Screen, Title } from '@/components/ui';

const ERA_KEY = {
  early: 'eraEarly',
  classical: 'eraClassical',
  later: 'eraLater',
} as const satisfies Record<Era, string>;

const SORT_KEY = {
  featured: 'sortFeatured',
  'chrono-asc': 'sortOldest',
  'chrono-desc': 'sortNewest',
  name: 'sortName',
} as const satisfies Record<SortKey, string>;

function Pill({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        {
          backgroundColor: active ? colors.accentTurmeric : colors.bgSunken,
          borderColor: active ? colors.accentTurmeric : colors.line,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text
        style={{
          color: active ? '#17130F' : colors.inkBody,
          fontSize: 13,
          fontWeight: active ? '600' : '400',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function FacetRow({ label, children }: { label: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={[styles.facetLabel, { color: colors.inkMuted }]}>{label}</Text>
      <View style={styles.pillRow}>{children}</View>
    </View>
  );
}

export default function DiscoverScreen() {
  const { locale: raw } = useLocalSearchParams<{ locale: string }>();
  const locale = asLocale(raw);
  const ui = t(locale);
  const d = ui.discover;
  const { colors } = useTheme();

  const temples = getTemples(locale);
  const circuits = getCircuits(locale);
  const regions = useMemo(() => regionsOf(temples), [temples]);
  // Native bundles the whole catalog, so there is no payload reason to split the
  // search-only fields out (as web does via a lazy index) — build the same
  // id → deity/tradition/style/period map in memory so search fidelity matches.
  const searchIndex = useMemo(
    () => Object.fromEntries(temples.map((tp) => [tp.id, searchIndexText(tp)])),
    [temples],
  );

  const [query, setQuery] = useState('');
  const [circuit, setCircuit] = useState('all');
  const [region, setRegion] = useState('all');
  const [era, setEra] = useState<Era | 'all'>('all');
  const [unescoOnly, setUnescoOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>('featured');

  const results = useMemo(
    () =>
      sortTemples(
        filterTemples(temples, { query, circuit, region, era, unescoOnly, searchIndex }),
        sort,
        locale,
      ),
    [temples, query, circuit, region, era, unescoOnly, sort, locale, searchIndex],
  );

  const filtersActive =
    query.trim() !== '' ||
    circuit !== 'all' ||
    region !== 'all' ||
    era !== 'all' ||
    unescoOnly ||
    sort !== 'featured';

  function reset() {
    setQuery('');
    setCircuit('all');
    setRegion('all');
    setEra('all');
    setUnescoOnly(false);
    setSort('featured');
  }

  return (
    <Screen>
      <Title>{ui.tabs.discover}</Title>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={d.searchPlaceholder}
        placeholderTextColor={colors.inkMuted}
        returnKeyType="search"
        clearButtonMode="while-editing"
        style={[
          styles.search,
          {
            backgroundColor: colors.bgRaised,
            borderColor: colors.line,
            color: colors.inkStrong,
          },
        ]}
      />

      {circuits.length > 0 && (
        <FacetRow label={d.circuit}>
          <Pill label={d.all} active={circuit === 'all'} onPress={() => setCircuit('all')} />
          {circuits.map((c) => (
            <Pill
              key={c.id}
              label={c.name}
              active={circuit === c.id}
              onPress={() => setCircuit(c.id)}
            />
          ))}
        </FacetRow>
      )}

      {regions.length > 1 && (
        <FacetRow label={d.region}>
          <Pill label={d.all} active={region === 'all'} onPress={() => setRegion('all')} />
          {regions.map((r) => (
            <Pill key={r} label={r} active={region === r} onPress={() => setRegion(r)} />
          ))}
        </FacetRow>
      )}

      <FacetRow label={d.era}>
        <Pill label={d.all} active={era === 'all'} onPress={() => setEra('all')} />
        {ERAS.map((e) => (
          <Pill key={e} label={d[ERA_KEY[e]]} active={era === e} onPress={() => setEra(e)} />
        ))}
      </FacetRow>

      <FacetRow label={d.sort}>
        {SORTS.map((s) => (
          <Pill key={s} label={d[SORT_KEY[s]]} active={sort === s} onPress={() => setSort(s)} />
        ))}
      </FacetRow>

      <View style={styles.bar}>
        <Pill
          label={d.unescoOnly}
          active={unescoOnly}
          onPress={() => setUnescoOnly((v) => !v)}
        />
        <Muted>
          {results.length} {d.results}
        </Muted>
        {filtersActive && (
          <Pressable
            accessibilityRole="button"
            onPress={reset}
            style={({ pressed }) => [
              styles.clear,
              { borderColor: colors.line, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={{ color: colors.inkBody, fontSize: 13 }}>{d.clear}</Text>
          </Pressable>
        )}
      </View>

      {results.length > 0 ? (
        results.map((tp) => (
          <Card key={tp.id} onPress={() => router.push(`/${locale}/temples/${tp.id}`)}>
            <Text style={{ color: colors.inkStrong, fontSize: 18, fontWeight: '600' }}>
              {tp.name}
            </Text>
            <NativeName>{tp.nativeName}</NativeName>
            <Muted>
              {tp.location.city}, {tp.location.state}
              {tp.unesco ? ` · ${ui.labels.unesco}` : ''}
            </Muted>
          </Card>
        ))
      ) : (
        <Text style={[styles.empty, { color: colors.inkMuted }]}>{d.none}</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    minHeight: MIN_TOUCH,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    fontSize: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  facetLabel: {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap' },
  pill: {
    minHeight: MIN_TOUCH,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 6,
    marginBottom: 6,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
    marginBottom: 14,
  },
  clear: {
    minHeight: MIN_TOUCH,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    marginLeft: 'auto',
  },
  empty: { textAlign: 'center', paddingVertical: 36 },
});
