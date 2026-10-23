import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
import type { ToyColor } from '@/gameData';
import { pictureFor } from '@/game/shapes';

export type SwatchPattern = 'dots' | 'stripes' | 'waves' | 'rings' | 'checks' | 'diamonds';

export const PATTERN_FOR_COLOR: Record<ToyColor, SwatchPattern> = {
  sunshine: 'dots',
  lagoon: 'stripes',
  tomato: 'waves',
  lilac: 'rings',
  mint: 'checks',
  peach: 'diamonds',
};

export function ColorMark({
  wash,
  strong,
  pattern,
  size,
}: {
  wash: string;
  strong: string;
  pattern: SwatchPattern;
  size: number;
}) {
  const ink = 'rgba(255,253,248,0.92)';
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        backgroundColor: wash,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Pattern pattern={pattern} color={strong} ink={ink} size={size} />
    </View>
  );
}

function Pattern({
  pattern,
  color,
  ink,
  size,
}: {
  pattern: SwatchPattern;
  color: string;
  ink: string;
  size: number;
}) {
  if (pattern === 'dots') {
    return (
      <View style={{ width: size * 0.62, height: size * 0.62, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignContent: 'space-between' }}>
        {[0, 1, 2, 3].map((dot) => (
          <View key={dot} style={{ width: size * 0.22, height: size * 0.22, borderRadius: size, backgroundColor: color }} />
        ))}
      </View>
    );
  }
  if (pattern === 'stripes') {
    return (
      <View style={{ width: '100%', height: '100%', justifyContent: 'space-evenly' }}>
        {[0, 1, 2].map((bar) => (
          <View key={bar} style={{ height: size * 0.14, backgroundColor: color }} />
        ))}
      </View>
    );
  }
  if (pattern === 'waves') {
    return (
      <View style={{ width: '78%', height: '70%', justifyContent: 'space-between' }}>
        {[0, 1, 2].map((wave) => (
          <View
            key={wave}
            style={{
              height: size * 0.16,
              borderRadius: size,
              backgroundColor: color,
              marginLeft: wave % 2 === 0 ? 0 : size * 0.12,
            }}
          />
        ))}
      </View>
    );
  }
  if (pattern === 'rings') {
    const outer = size * 0.72;
    const inner = size * 0.38;
    return (
      <View style={{ width: outer, height: outer, borderRadius: outer, borderWidth: size * 0.1, borderColor: color, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: inner, height: inner, borderRadius: inner, backgroundColor: color }} />
      </View>
    );
  }
  if (pattern === 'checks') {
    return (
      <View style={{ width: size * 0.7, height: size * 0.7, flexDirection: 'row', flexWrap: 'wrap' }}>
        {[0, 1, 2, 3].map((cell) => (
          <View
            key={cell}
            style={{
              width: '50%',
              height: '50%',
              backgroundColor: cell === 0 || cell === 3 ? color : ink,
            }}
          />
        ))}
      </View>
    );
  }
  const diamond = size * 0.22;
  return (
    <View style={{ width: size * 0.7, height: size * 0.62, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {[0, 1, 2].map((piece) => (
        <View
          key={piece}
          style={{
            width: diamond,
            height: diamond,
            backgroundColor: color,
            transform: [{ rotate: '45deg' }],
          }}
        />
      ))}
    </View>
  );
}

export function ToyArt({
  toyId,
  color,
  size,
}: {
  toyId: string;
  color: string;
  size: number;
}) {
  const picture = pictureFor(toyId);
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      {picture === 'duck' ? <Duck color={color} /> : null}
      {picture === 'locomotive' ? <Train color={color} /> : null}
      {picture === 'blocks' ? <Blocks color={color} /> : null}
      {picture === 'bear' ? <Bear color={color} /> : null}
      {picture === 'striped-ball' ? <Ball color={color} /> : null}
      {picture === 'pickup' ? <Truck color={color} /> : null}
    </Svg>
  );
}

function Duck({ color }: { color: string }) {
  return (
    <>
      <Ellipse cx="28" cy="40" rx="16" ry="11" fill={color} />
      <Circle cx="44" cy="28" r="11" fill={color} />
      <Path d="M52 27 L63 32 L52 37 Z" fill="#E2A12A" />
      <Circle cx="47" cy="26" r="1.7" fill="#263A2E" />
      <Ellipse cx="22" cy="36" rx="7" ry="4" fill="#FFFDF8" fillOpacity={0.35} />
    </>
  );
}

function Train({ color }: { color: string }) {
  return (
    <>
      <Rect x="8" y="30" width="34" height="14" rx="3" fill={color} />
      <Rect x="30" y="16" width="16" height="28" rx="2" fill={color} />
      <Rect x="14" y="16" width="6" height="14" fill={color} />
      <Rect x="12" y="12" width="10" height="4" rx="1" fill="#263A2E" />
      <Rect x="34" y="20" width="8" height="7" rx="1" fill="#FFFDF8" />
      <Circle cx="18" cy="48" r="5" fill="#263A2E" />
      <Circle cx="40" cy="48" r="5" fill="#263A2E" />
      <Circle cx="18" cy="48" r="2" fill="#F8F6EE" />
      <Circle cx="40" cy="48" r="2" fill="#F8F6EE" />
    </>
  );
}

function Truck({ color }: { color: string }) {
  return (
    <>
      <Rect x="6" y="28" width="28" height="14" rx="2" fill={color} />
      <Path d="M34 32 H50 L58 40 V42 H34 Z" fill={color} />
      <Rect x="40" y="34" width="8" height="6" fill="#FFFDF8" />
      <Circle cx="16" cy="48" r="5" fill="#263A2E" />
      <Circle cx="46" cy="48" r="5" fill="#263A2E" />
      <Circle cx="16" cy="48" r="2" fill="#F8F6EE" />
      <Circle cx="46" cy="48" r="2" fill="#F8F6EE" />
    </>
  );
}

function Blocks({ color }: { color: string }) {
  return (
    <>
      <Rect x="10" y="34" width="18" height="16" rx="2" fill={color} />
      <Rect x="30" y="38" width="20" height="12" rx="2" fill={color} fillOpacity={0.8} />
      <Rect x="22" y="16" width="18" height="16" rx="2" fill={color} />
      <Path d="M14 34 H24 M34 38 H46 M26 16 H36" stroke="#FFFDF8" strokeWidth="2" />
    </>
  );
}

function Bear({ color }: { color: string }) {
  return (
    <>
      <Circle cx="16" cy="16" r="8" fill={color} />
      <Circle cx="48" cy="16" r="8" fill={color} />
      <Circle cx="32" cy="34" r="18" fill={color} />
      <Ellipse cx="32" cy="40" rx="8" ry="6" fill="#FFFDF8" />
      <Circle cx="25" cy="32" r="2" fill="#263A2E" />
      <Circle cx="39" cy="32" r="2" fill="#263A2E" />
      <Ellipse cx="32" cy="39" rx="2.2" ry="1.6" fill="#263A2E" />
    </>
  );
}

function Ball({ color }: { color: string }) {
  return (
    <>
      <Circle cx="32" cy="32" r="20" fill={color} />
      <Path d="M14 26 C24 22 40 42 50 36" stroke="#FFFDF8" strokeWidth="5" fill="none" strokeLinecap="round" />
      <Path d="M18 42 C28 36 36 28 46 24" stroke="#FFFDF8" strokeWidth="3" fill="none" strokeLinecap="round" opacity={0.7} />
    </>
  );
}
