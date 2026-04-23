import { StyleSheet, View, type DimensionValue } from 'react-native';

import type { AppPalette } from '@/constants/app-theme';

export function ChromaticBackdrop({ palette }: { palette: AppPalette }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {palette.mode === 'sunny' ? <LightBackdrop palette={palette} /> : <DarkBackdrop palette={palette} />}
    </View>
  );
}

function LightBackdrop({ palette }: { palette: AppPalette }) {
  return (
    <>
      <View style={[styles.sideBlockLight, { backgroundColor: palette.accent }]} />
      <View style={[styles.ringLight, { borderColor: '#C78664' }]} />
      <View style={[styles.blobLight, { backgroundColor: palette.accent }]} />
      <DotGrid top="16%" left="81%" rows={8} cols={5} color="#FFFFFF" opacity={0.86} />
      <DotGrid top="4%" left="34%" rows={6} cols={1} color="#FFFFFF" opacity={0.84} />
      <DotRow top="50%" left="5%" count={8} color="#FFFFFF" opacity={0.82} />
      <ArcDots bottom="17%" left="3%" radius={126} count={11} color="#FFFFFF" opacity={0.86} />
      <HatchBand top="13%" left="16%" count={7} color="#FFFFFF" />
      <HatchBand top="57%" left="18%" count={9} color="#FFFFFF" horizontal />
    </>
  );
}

function DarkBackdrop({ palette }: { palette: AppPalette }) {
  return (
    <>
      <View style={[styles.sideBlockDark, { backgroundColor: '#252B36' }]} />
      <View style={[styles.blobDarkTop, { backgroundColor: '#2F3745' }]} />
      <View style={[styles.blobDarkBottom, { backgroundColor: '#2A313D' }]} />
      <DotGrid top="7%" left="9%" rows={6} cols={4} color="#8E949E" opacity={0.7} />
      <DotGrid top="58%" left="82%" rows={8} cols={4} color={palette.accent} opacity={0.72} />
      <ArcDots top="13%" right="-6%" radius={112} count={11} color={palette.accent} opacity={0.62} />
      <ArcDots bottom="-2%" left="-7%" radius={122} count={11} color={palette.accent} opacity={0.58} />
      <HatchBand top="22%" left="8%" count={7} color={palette.accent} />
      <HatchBand top="78%" left="52%" count={10} color="#5A616D" horizontal />
    </>
  );
}

function DotGrid({
  top,
  left,
  rows,
  cols,
  color,
  opacity = 1,
}: {
  top?: DimensionValue;
  left?: DimensionValue;
  rows: number;
  cols: number;
  color: string;
  opacity?: number;
}) {
  const dots = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      dots.push(
        <View
          key={`${row}-${col}`}
          style={[styles.dot, { top: row * 18, left: col * 18, backgroundColor: color, opacity }]}
        />
      );
    }
  }

  return <View style={[styles.gridWrap, { top, left }]}>{dots}</View>;
}

function DotRow({
  top,
  left,
  count,
  color,
  opacity = 1,
}: {
  top: DimensionValue;
  left: DimensionValue;
  count: number;
  color: string;
  opacity?: number;
}) {
  return (
    <View style={[styles.rowWrap, { top, left }]}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={`dot-row-${index}`}
          style={[styles.dot, { left: index * 36, backgroundColor: color, opacity }]}
        />
      ))}
    </View>
  );
}

function ArcDots({
  top,
  right,
  bottom,
  left,
  radius,
  count,
  color,
  opacity = 1,
}: {
  top?: DimensionValue;
  right?: DimensionValue;
  bottom?: DimensionValue;
  left?: DimensionValue;
  radius: number;
  count: number;
  color: string;
  opacity?: number;
}) {
  return (
    <View style={[styles.arcWrap, { top, right, bottom, left, width: radius * 2, height: radius * 2 }]}>
      {Array.from({ length: count }).map((_, index) => {
        const ratio = index / Math.max(count - 1, 1);
        const angle = Math.PI * (0.15 + ratio * 0.7);
        const x = Math.cos(angle) * radius + radius;
        const y = Math.sin(angle) * radius + radius;
        return (
          <View
            key={`arc-${index}`}
            style={[styles.dot, { left: x - 2, top: y - 2, backgroundColor: color, opacity }]}
          />
        );
      })}
    </View>
  );
}

function HatchBand({
  top,
  left,
  count,
  color,
  horizontal = false,
}: {
  top: DimensionValue;
  left: DimensionValue;
  count: number;
  color: string;
  horizontal?: boolean;
}) {
  return (
    <View style={[styles.hatchWrap, { top, left }]}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={`hatch-${index}`}
          style={[
            styles.hatch,
            horizontal ? styles.hatchHorizontal : styles.hatchVertical,
            {
              backgroundColor: color,
              left: horizontal ? index * 26 : index * 0,
              top: horizontal ? 0 : index * 18,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sideBlockLight: {
    position: 'absolute',
    top: '4%',
    left: '-14%',
    width: '24%',
    height: '38%',
    opacity: 0.68,
  },
  sideBlockDark: {
    position: 'absolute',
    top: '8%',
    left: '-12%',
    width: '22%',
    height: '36%',
    opacity: 0.48,
  },
  ringLight: {
    position: 'absolute',
    bottom: '-10%',
    left: '26%',
    width: 500,
    height: 500,
    borderRadius: 250,
    borderWidth: 3,
    opacity: 0.72,
  },
  blobLight: {
    position: 'absolute',
    right: '-28%',
    bottom: '-22%',
    width: 420,
    height: 420,
    borderRadius: 210,
    opacity: 0.7,
  },
  blobDarkTop: {
    position: 'absolute',
    top: '-7%',
    right: '-30%',
    width: 360,
    height: 360,
    borderRadius: 180,
    opacity: 0.52,
  },
  blobDarkBottom: {
    position: 'absolute',
    bottom: '-15%',
    left: '-31%',
    width: 320,
    height: 320,
    borderRadius: 160,
    opacity: 0.48,
  },
  gridWrap: {
    position: 'absolute',
    width: 110,
    height: 170,
  },
  rowWrap: {
    position: 'absolute',
    width: 300,
    height: 6,
  },
  arcWrap: {
    position: 'absolute',
  },
  dot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  hatchWrap: {
    position: 'absolute',
    width: 260,
    height: 140,
  },
  hatch: {
    position: 'absolute',
    width: 28,
    height: 2,
    borderRadius: 2,
    opacity: 0.86,
    transform: [{ rotate: '42deg' }],
  },
  hatchVertical: {},
  hatchHorizontal: {
    transform: [{ rotate: '138deg' }],
  },
});
