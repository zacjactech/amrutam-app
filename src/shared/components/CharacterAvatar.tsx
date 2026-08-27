import React from 'react';
import { View, StyleSheet } from 'react-native';

type Mood = 'happy' | 'neutral' | 'sad' | 'surprised' | 'calm';

export interface CharacterAvatarProps {
  mood: Mood;
  size?: number;
}

const C = {
  skin: '#FDE68A',
  skinLight: '#FEF3C7',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  primary: '#2D6A4F',
  primaryLight: '#52B788',
  white: '#FFFFFF',
  red: '#DC2626',
  blue: '#3B82F6',
};

const Circle: React.FC<{
  size: number;
  color: string;
  style?: object | undefined;
}> = ({ size: s, color, style }) => (
  <View
    style={[
      { width: s, height: s, borderRadius: s / 2, backgroundColor: color },
      style,
    ]}
  />
);

const Rect: React.FC<{
  w: number;
  h: number;
  color: string;
  radius?: number;
  style?: object | undefined;
}> = ({ w, h, color, radius = 0, style }) => (
  <View
    style={[
      { width: w, height: h, borderRadius: radius, backgroundColor: color },
      style,
    ]}
  />
);

const Dot: React.FC<{ size: number; color: string; style?: object | undefined }> = ({
  size: s,
  color,
  style,
}) => <Circle size={s} color={color} style={style} />;

const Eyes: React.FC<{ mood: Mood; s: number }> = ({ mood, s }) => {
  switch (mood) {
    case 'happy':
      return (
        <>
          <View
            style={[
              eyeLeft(s),
              { transform: [{ rotate: '10deg' }] },
            ]}
          >
            <Rect w={5 * s} h={2 * s} color={C.text} radius={1 * s} />
          </View>
          <View
            style={[
              eyeRight(s),
              { transform: [{ rotate: '-10deg' }] },
            ]}
          >
            <Rect w={5 * s} h={2 * s} color={C.text} radius={1 * s} />
          </View>
        </>
      );
    case 'sad':
      return (
        <>
          <View
            style={[
              eyeLeft(s),
              { transform: [{ rotate: '-10deg' }] },
            ]}
          >
            <Rect w={5 * s} h={2 * s} color={C.text} radius={1 * s} />
          </View>
          <View
            style={[
              eyeRight(s),
              { transform: [{ rotate: '10deg' }] },
            ]}
          >
            <Rect w={5 * s} h={2 * s} color={C.text} radius={1 * s} />
          </View>
        </>
      );
    case 'surprised':
      return (
        <>
          <Circle size={6 * s} color={C.white} style={eyeLeft(s)} />
          <Dot size={3 * s} color={C.text} style={{ position: 'absolute' as const, bottom: 14 * s + 1.5 * s, left: 9 * s + 1.5 * s }} />
          <Circle size={6 * s} color={C.white} style={eyeRight(s)} />
          <Dot size={3 * s} color={C.text} style={{ position: 'absolute' as const, bottom: 14 * s + 1.5 * s, left: 23 * s + 1.5 * s }} />
        </>
      );
    case 'calm':
      return (
        <>
          <View style={eyeLeft(s)}>
            <Rect w={5 * s} h={1.5 * s} color={C.text} radius={0.75 * s} />
          </View>
          <View style={eyeRight(s)}>
            <Rect w={5 * s} h={1.5 * s} color={C.text} radius={0.75 * s} />
          </View>
        </>
      );
    default:
      return (
        <>
          <Dot size={4 * s} color={C.text} style={eyeLeft(s)} />
          <Dot size={4 * s} color={C.text} style={eyeRight(s)} />
        </>
      );
  }
};

const Mouth: React.FC<{ mood: Mood; s: number }> = ({ mood, s }) => {
  const base = { position: 'absolute' as const };
  switch (mood) {
    case 'happy':
      return (
        <View style={{ ...base, bottom: 6 * s, left: (40 * s - 10 * s) / 2 }}>
          <Rect w={10 * s} h={2.5 * s} color={C.primary} radius={1.25 * s} />
        </View>
      );
    case 'sad':
      return (
        <View
          style={{
            ...base,
            bottom: 5 * s,
            left: (40 * s - 8 * s) / 2,
            transform: [{ rotate: '180deg' }],
          }}
        >
          <Rect w={8 * s} h={2 * s} color={C.textSecondary} radius={1 * s} />
        </View>
      );
    case 'surprised':
      return (
        <Circle
          size={8 * s}
          color={C.red}
          style={{ ...base, bottom: 4 * s, left: (40 * s - 8 * s) / 2 }}
        />
      );
    case 'calm':
      return (
        <View style={{ ...base, bottom: 6 * s, left: (40 * s - 6 * s) / 2 }}>
          <Rect w={6 * s} h={2 * s} color={C.primaryLight} radius={1 * s} />
        </View>
      );
    default:
      return (
        <View style={{ ...base, bottom: 6 * s, left: (40 * s - 8 * s) / 2 }}>
          <Rect w={8 * s} h={2 * s} color={C.textSecondary} radius={1 * s} />
        </View>
      );
  }
};

const eyeLeft = (s: number) => ({
  position: 'absolute' as const,
  bottom: 14 * s,
  left: 9 * s,
});
const eyeRight = (s: number) => ({
  position: 'absolute' as const,
  bottom: 14 * s,
  left: 23 * s,
});

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  mood,
  size = 48,
}) => {
  const s = size / 48;
  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessibilityLabel={`${mood} character avatar`}
    >
      {/* Head */}
      <Circle size={40 * s} color={C.skinLight} style={{ position: 'absolute', top: 4 * s, left: 4 * s }} />
      {/* Hair */}
      <View style={{ position: 'absolute', top: 0, left: 8 * s }}>
        <Rect w={32 * s} h={10 * s} color={C.text} radius={5 * s} />
      </View>
      {/* Eyes */}
      <Eyes mood={mood} s={s} />
      {/* Mouth */}
      <Mouth mood={mood} s={s} />
      {/* Blush for happy/calm */}
      {(mood === 'happy' || mood === 'calm') && (
        <>
          <Circle
            size={5 * s}
            color="#FCA5A5"
            style={{ position: 'absolute', bottom: 10 * s, left: 5 * s, opacity: 0.5 }}
          />
          <Circle
            size={5 * s}
            color="#FCA5A5"
            style={{ position: 'absolute', bottom: 10 * s, right: 5 * s, opacity: 0.5 }}
          />
        </>
      )}
      {/* Sweat drop for surprised */}
      {mood === 'surprised' && (
        <View style={{ position: 'absolute', top: 6 * s, right: 2 * s, transform: [{ rotate: '15deg' }] }}>
          <Rect w={3 * s} h={7 * s} color={C.blue} radius={1.5 * s} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
