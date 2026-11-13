import { useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { router } from 'expo-router';
import { DOT_R, layoutCircuitMap, SOUTH_ASIA_LAND, type Temple } from '@temple/core';
import { useTheme } from '@/lib/theme';

// Native counterpart of the web circuit route map (apps/web/components/
// CircuitMap.tsx): the same shared layout (packages/core circuit-map.ts) drawn
// with react-native-svg, in the illustrated style — parchment land, gopuram
// tower markers with numbered medallions, a title ribbon and compass rose, and
// a bus that drives the route (React Native Animated; paused when the OS
// "reduce motion" setting is on). Pins and labels open the temple; the route
// follows the suggested driving order while numbering keeps the official order.

const BAND = 84;
// 4-tier gopuram in a 40×48 box, base centered at (20, 46).
const TOWER =
  'M7 46 L33 46 L31 37 L9 37 Z M9 37 L31 37 L29 28 L11 28 Z ' +
  'M11 28 L29 28 L27 19 L13 19 Z M13 19 L27 19 L25 11 L15 11 Z M15 11 L20 4 L25 11 Z';

const AG = Animated.createAnimatedComponent(G);

export function CircuitMap({
  temples,
  locale,
  title,
  circuitName,
  note,
  orderLabel,
  routeTotalLabel,
  routeEstimateLabel,
  units,
  offset = 0,
}: {
  temples: Temple[];
  locale: string;
  title: string;
  circuitName?: string;
  note: string;
  orderLabel: string;
  routeTotalLabel: string;
  routeEstimateLabel: string;
  units: { km: string; hr: string; min: string };
  /** Numbering offset for a grouped circuit's later sections. */
  offset?: number;
}) {
  const { colors, dark } = useTheme();
  const layout = useMemo(
    () =>
      layoutCircuitMap(
        temples.map((t) => ({
          id: t.id,
          name: t.name,
          city: t.location.city,
          lat: t.location.lat,
          lng: t.location.lng,
        })),
        SOUTH_ASIA_LAND,
        { offset }
      ),
    [temples, offset]
  );

  // Ordered points along the driving route (for the moving traveller).
  const route = useMemo(() => {
    const byN = new Map(layout.pins.map((p) => [p.n, p]));
    const pts = layout.order.map((n) => byN.get(n)).filter(Boolean) as { x: number; y: number }[];
    const cum = [0];
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i]!.x - pts[i - 1]!.x;
      const dy = pts[i]!.y - pts[i - 1]!.y;
      cum.push(cum[i - 1]! + Math.max(0.01, Math.hypot(dx, dy)));
    }
    const total = cum[cum.length - 1] || 1;
    return { pts, input: cum.map((c) => c / total) };
  }, [layout]);

  const t = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((r) => active && setReduceMotion(!!r));
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (reduceMotion || route.pts.length < 2) return;
    const dur = Math.min(42000, Math.max(13000, layout.pins.length * 2400));
    const loop = Animated.loop(
      Animated.timing(t, { toValue: 1, duration: dur, easing: Easing.linear, useNativeDriver: false })
    );
    loop.start();
    return () => loop.stop();
  }, [reduceMotion, route, layout.pins.length, t]);

  if (!layout.pins.length) return null;

  const sea = dark ? '#0F1D24' : '#D3E5E4';
  const seaTop = dark ? '#163038' : '#E2EEEC';
  const land = dark ? '#2A2118' : '#F4ECDA';
  const landHi = dark ? '#322817' : '#FAF3E0';
  const coast = dark ? '#4A3D2C' : '#C9B48A';
  const tower = dark ? '#B87A48' : '#C58A5A';
  const towerEdge = dark ? '#D89A63' : '#9C5F34';
  const open = (id: string) => router.push(`/${locale}/temples/${id}`);
  const { width: W, height: H } = layout;

  const ribbonW = Math.min(W * 0.72, 560);
  const ribbonX = (W - ribbonW) / 2;
  const name = circuitName ?? title;
  const ribbonFont = name.length > 34 ? 15 : name.length > 24 ? 18 : 21;
  const start = layout.pins.find((p) => p.n === 1 + offset) ?? layout.pins[0]!;

  const stats = layout.route;
  const nameById = new Map(temples.map((tp) => [tp.id, tp.name]));
  const stopByN = new Map(layout.pins.map((p) => [p.n, p]));
  const fmtKm = (km: number) => `${Math.max(1, Math.round(km))} ${units.km}`;
  const fmtDur = (min: number) => {
    const tt = Math.max(5, Math.round(min / 5) * 5);
    const h = Math.floor(tt / 60);
    const m = tt % 60;
    return h ? (m ? `${h} ${units.hr} ${m} ${units.min}` : `${h} ${units.hr}`) : `${m} ${units.min}`;
  };

  const vx = route.pts.length >= 2
    ? t.interpolate({ inputRange: route.input, outputRange: route.pts.map((p) => p.x) })
    : start.x;
  const vy = route.pts.length >= 2
    ? t.interpolate({ inputRange: route.input, outputRange: route.pts.map((p) => p.y) })
    : start.y;

  const Bus = (
    <>
      <Rect x={-13} y={-7} width={26} height={14} rx={3} fill={colors.accentVermilion} stroke="#fff" strokeWidth={1.5} />
      <Rect x={2} y={-4.5} width={8} height={5} rx={1} fill="#FFE9B0" />
      <Rect x={-8} y={-4.5} width={8} height={5} rx={1} fill="#FFE9B0" />
      <Circle cx={-7} cy={8} r={2.6} fill="#2B2118" stroke="#fff" strokeWidth={0.8} />
      <Circle cx={7} cy={8} r={2.6} fill="#2B2118" stroke="#fff" strokeWidth={0.8} />
    </>
  );

  return (
    <View style={{ marginVertical: 12 }}>
      <View
        style={{ borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.line }}
        accessible
        accessibilityLabel={`${title}: ${name}`}
      >
        <Svg viewBox={`0 ${-BAND} ${W} ${H + BAND}`} style={{ width: '100%', aspectRatio: W / (H + BAND) }}>
          <Rect x={0} y={-BAND} width={W} height={BAND} fill={landHi} />
          <Rect x={0} y={0} width={W} height={H} fill={sea} />
          <Rect x={0} y={0} width={W} height={Math.min(H, 90)} fill={seaTop} opacity={0.5} />
          {layout.landPath ? (
            <Path d={layout.landPath} fill={land} stroke={coast} strokeWidth={1.5} strokeLinejoin="round" />
          ) : null}

          <Path d={layout.routePath} fill="none" stroke={colors.accentTurmeric} strokeWidth={13} strokeOpacity={0.2} strokeLinecap="round" strokeLinejoin="round" />
          <Path d={layout.routePath} fill="none" stroke={colors.accentTurmeric} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
          <Path d={layout.routePath} fill="none" stroke="#FFF6E2" strokeWidth={2} strokeOpacity={0.9} strokeLinecap="round" strokeDasharray="2 16" />

          {/* Moving traveller (or parked at stop 1 under reduce-motion). */}
          {reduceMotion || route.pts.length < 2 ? (
            <G x={start.x} y={start.y - 2}>{Bus}</G>
          ) : (
            <AG x={vx as unknown as number} y={vy as unknown as number}>{Bus}</AG>
          )}

          {layout.labels.map((l) =>
            l.leader ? (
              <Line key={`leader-${l.id}`} x1={l.leader.x1} y1={l.leader.y1} x2={l.leader.x2} y2={l.leader.y2} stroke={colors.inkMuted} strokeWidth={1.5} strokeDasharray="3 3" />
            ) : null
          )}

          {layout.mode === 'compact' &&
            layout.pins.map((p) => (
              <G key={p.id} onPress={() => open(p.id)}>
                <Circle cx={p.x} cy={p.y} r={DOT_R} fill={colors.accentVermilion} stroke="#fff" strokeWidth={1.5} />
                <SvgText x={p.x} y={p.y + 4} fill="#fff" fontSize={p.n > 99 ? 9 : 11} fontWeight="700" textAnchor="middle">
                  {p.n}
                </SvgText>
              </G>
            ))}

          {layout.labels.map((l) => {
            const pin = layout.pins.find((p) => p.id === l.id);
            if (!pin) return null;
            return (
              <G key={l.id} onPress={() => open(l.id)}>
                <G x={pin.x} y={pin.y}>
                  <Ellipse cx={0} cy={3} rx={16} ry={5} fill="#000" opacity={0.14} />
                  <G x={-18} y={-43} scale={36 / 40}>
                    <Path d={TOWER} fill={tower} stroke={towerEdge} strokeWidth={1} strokeLinejoin="round" />
                    <Circle cx={20} cy={3} r={2.4} fill={colors.accentTurmeric} stroke={towerEdge} strokeWidth={0.8} />
                  </G>
                  <Circle cx={0} cy={-46} r={11} fill={colors.accentVermilion} stroke={colors.bgRaised} strokeWidth={2} />
                  <SvgText x={0} y={-42} fill="#fff" fontSize={l.n > 99 ? 9 : 12} fontWeight="700" textAnchor="middle">
                    {l.n}
                  </SvgText>
                </G>
                <G x={l.x} y={l.y}>
                  <Rect width={l.w} height={l.h} rx={12} fill={colors.bgRaised} stroke={colors.accentTurmeric} strokeWidth={1.5} />
                  {l.lines.map((line, i) => (
                    <SvgText key={i} x={18} y={30 + i * 24} fill={colors.inkStrong} fontSize={l.nameFont} fontWeight="700">
                      {line}
                    </SvgText>
                  ))}
                  <SvgText x={18} y={l.h - 13} fill={colors.inkMuted} fontSize={16}>
                    {l.city}
                  </SvgText>
                </G>
              </G>
            );
          })}

          {/* Title ribbon */}
          <G x={ribbonX} y={-BAND + 20}>
            <Path d="M-18 14 L0 6 L0 40 L-18 48 Z" fill={towerEdge} />
            <Path d={`M${ribbonW + 18} 14 L${ribbonW} 6 L${ribbonW} 40 L${ribbonW + 18} 48 Z`} fill={towerEdge} />
            <Rect x={0} y={0} width={ribbonW} height={46} rx={6} fill={colors.bgRaised} stroke={colors.accentTurmeric} strokeWidth={2} />
            <SvgText x={ribbonW / 2} y={30} fill={colors.accentVermilion} fontSize={ribbonFont} fontWeight="700" textAnchor="middle">
              {name}
            </SvgText>
          </G>

          <G x={layout.scale.x} y={layout.scale.y}>
            <Line x1={0} y1={0} x2={layout.scale.length} y2={0} stroke={colors.inkBody} strokeWidth={2} />
            <Line x1={0} y1={-5} x2={0} y2={5} stroke={colors.inkBody} strokeWidth={2} />
            <Line x1={layout.scale.length} y1={-5} x2={layout.scale.length} y2={5} stroke={colors.inkBody} strokeWidth={2} />
            <SvgText x={layout.scale.length / 2} y={-9} fill={colors.inkBody} fontSize={15} fontWeight="600" textAnchor="middle">
              {layout.scale.label}
            </SvgText>
          </G>
          <G x={W - 64} y={66}>
            <Circle r={28} fill={colors.bgRaised} stroke={coast} strokeWidth={1.5} opacity={0.92} />
            <Path d="M0 -24 L6 0 L0 -5 L-6 0 Z" fill={colors.accentVermilion} />
            <Path d="M0 24 L6 0 L0 5 L-6 0 Z" fill={colors.inkMuted} />
            <SvgText x={0} y={-30} fill={colors.inkBody} fontSize={13} fontWeight="700" textAnchor="middle">
              N
            </SvgText>
          </G>
        </Svg>
      </View>
      {layout.order.length > 1 ? (
        <Text style={{ color: colors.inkBody, fontWeight: '600', fontSize: 14, marginTop: 6 }}>
          {routeTotalLabel}: ≈ {fmtKm(stats.totalKm)} · ≈ {fmtDur(stats.totalMin)}
        </Text>
      ) : null}
      {/* Per-leg breakdown for the small (label-mode) maps; big circuits show
          the total only, to keep the native list light. Each stop carries a
          numbered badge (matching the map pin); the leg to the next stop hangs
          below it as an indented arrow + distance, so it reads unambiguously as
          travel between two stops rather than a figure pinned to one name. */}
      {layout.mode !== 'compact' && layout.order.length > 2 ? (
        <View style={{ marginTop: 8 }}>
          <Text style={{ color: colors.inkMuted, fontWeight: '600', fontSize: 12, marginBottom: 4 }}>{orderLabel}</Text>
          {layout.order.map((n, i) => (
            <View key={n}>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 2 }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: colors.accentVermilion,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{n}</Text>
                </View>
                <Text style={{ color: colors.inkBody, fontSize: 13, fontWeight: '600', flexShrink: 1 }}>
                  {nameById.get(stopByN.get(n)?.id ?? '') ?? ''}
                </Text>
              </View>
              {i < layout.order.length - 1 && stats.legsKm[i] !== undefined ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 9,
                    paddingLeft: 15,
                    paddingBottom: 3,
                    borderLeftWidth: 2,
                    borderLeftColor: colors.line,
                  }}
                >
                  <Text style={{ color: colors.accentTurmeric, fontSize: 13, fontWeight: '700', marginRight: 6 }}>↓</Text>
                  <Text style={{ color: colors.inkMuted, fontSize: 12 }}>
                    ≈ {fmtKm(stats.legsKm[i]!)} · ≈ {fmtDur(stats.legsMin[i]!)}
                  </Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}
      {layout.order.length > 1 ? (
        <Text style={{ color: colors.inkMuted, fontSize: 12, marginTop: 4 }}>
          {routeEstimateLabel} {note}
        </Text>
      ) : (
        <Text style={{ color: colors.inkMuted, fontSize: 13, marginTop: 2 }}>{note}</Text>
      )}
    </View>
  );
}
