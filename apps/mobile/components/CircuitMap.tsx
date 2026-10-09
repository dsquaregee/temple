import { useMemo } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from 'react-native-svg';
import { router } from 'expo-router';
import { layoutCircuitMap, SOUTH_INDIA_LAND, type Temple } from '@temple/core';
import { useTheme } from '@/lib/theme';

// Native counterpart of the web circuit route map (apps/web/components/
// CircuitMap.tsx): the same shared layout (packages/core circuit-map.ts) drawn
// with react-native-svg. Pins and labels open the temple; the route follows the
// suggested driving order while numbering keeps the circuit's official order.

// Stylized gopuram (gateway tower) — architecture, not deity imagery.
const GOPURAM =
  'M12 1.5l1.3 2.2H10.7zM9.6 4.6h4.8l.9 3H8.7zM8.2 8.5h7.6l1 3.4H7.2zM6.6 12.8h10.8l1.1 3.8H5.5zM4.8 17.5h14.4l1.2 4.5H3.6z';

export function CircuitMap({
  temples,
  locale,
  title,
  note,
  orderLabel,
}: {
  temples: Temple[];
  locale: string;
  title: string;
  note: string;
  orderLabel: string;
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
        SOUTH_INDIA_LAND
      ),
    [temples]
  );
  if (!layout.pins.length) return null;

  const sea = dark ? '#0F1D24' : '#D3E5E4';
  const land = dark ? '#26201A' : '#F4ECDA';
  const coast = dark ? '#4A3D2C' : '#C9B48A';
  const open = (id: string) => router.push(`/${locale}/temples/${id}`);
  const { width: W, height: H } = layout;

  return (
    <View style={{ marginVertical: 12 }}>
      <View
        style={{ borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.line }}
        accessible
        accessibilityLabel={title}
      >
        <Svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', aspectRatio: W / H }}>
          <Rect width={W} height={H} fill={sea} />
          {layout.landPath ? (
            <Path d={layout.landPath} fill={land} stroke={coast} strokeWidth={1.5} strokeLinejoin="round" />
          ) : null}
          <Path
            d={layout.routePath}
            fill="none"
            stroke={colors.accentTurmeric}
            strokeWidth={12}
            strokeOpacity={0.22}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d={layout.routePath}
            fill="none"
            stroke={colors.accentTurmeric}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {layout.labels.map((l) =>
            l.leader ? (
              <Line
                key={`leader-${l.id}`}
                x1={l.leader.x1}
                y1={l.leader.y1}
                x2={l.leader.x2}
                y2={l.leader.y2}
                stroke={colors.inkMuted}
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
            ) : null
          )}
          {layout.labels.map((l) => {
            const pin = layout.pins[l.n - 1];
            if (!pin) return null;
            return (
              <G key={l.id} onPress={() => open(l.id)}>
                <G x={pin.x} y={pin.y}>
                  <Path
                    d="M0 0C-6-9-15-15-15-24a15 15 0 1 1 30 0C15-15 6-9 0 0z"
                    fill={colors.accentVermilion}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                  <SvgText x={0} y={-19} fill="#fff" fontSize={16} fontWeight="700" textAnchor="middle">
                    {l.n}
                  </SvgText>
                </G>
                <G x={l.x} y={l.y}>
                  <Rect
                    width={l.w}
                    height={l.h}
                    rx={10}
                    fill={colors.bgRaised}
                    stroke={colors.accentTurmeric}
                    strokeWidth={1.5}
                  />
                  <G x={7} y={l.h / 2 - 15} scale={26 / 24}>
                    <Path d={GOPURAM} fill={colors.accentTurmeric} />
                  </G>
                  <Circle cx={31} cy={l.h / 2 + 9} r={9.5} fill={colors.accentVermilion} stroke={colors.bgRaised} strokeWidth={2} />
                  <SvgText x={31} y={l.h / 2 + 13.5} fill="#fff" fontSize={12} fontWeight="700" textAnchor="middle">
                    {l.n}
                  </SvgText>
                  {l.lines.map((line, i) => (
                    <SvgText key={i} x={46} y={30 + i * 24} fill={colors.inkStrong} fontSize={l.nameFont} fontWeight="700">
                      {line}
                    </SvgText>
                  ))}
                  <SvgText x={46} y={l.h - 13} fill={colors.inkMuted} fontSize={18}>
                    {l.city}
                  </SvgText>
                </G>
              </G>
            );
          })}
          <G x={layout.scale.x} y={layout.scale.y}>
            <Line x1={0} y1={0} x2={layout.scale.length} y2={0} stroke={colors.inkBody} strokeWidth={2} />
            <Line x1={0} y1={-5} x2={0} y2={5} stroke={colors.inkBody} strokeWidth={2} />
            <Line x1={layout.scale.length} y1={-5} x2={layout.scale.length} y2={5} stroke={colors.inkBody} strokeWidth={2} />
            <SvgText x={layout.scale.length / 2} y={-9} fill={colors.inkBody} fontSize={15} fontWeight="600" textAnchor="middle">
              {layout.scale.label}
            </SvgText>
          </G>
          <G x={layout.scale.x + layout.scale.length + 34} y={layout.scale.y - 6}>
            <Path d="M0-14L6 6L0 2L-6 6z" fill={colors.accentVermilion} />
            <SvgText x={13} y={5} fill={colors.inkBody} fontSize={15} fontWeight="600">
              N
            </SvgText>
          </G>
        </Svg>
      </View>
      {layout.order.length > 2 ? (
        <Text style={{ color: colors.inkBody, fontWeight: '600', fontSize: 13, marginTop: 6 }}>
          {orderLabel}: {layout.order.join(' → ')}
        </Text>
      ) : null}
      <Text style={{ color: colors.inkMuted, fontSize: 13, marginTop: 2 }}>{note}</Text>
    </View>
  );
}
