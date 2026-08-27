import React from 'react';
import { View, StyleSheet } from 'react-native';

// Colors from theme
const C = {
  primary: '#2D6A4F',
  primaryLight: '#52B788',
  primarySoft: '#D1FAE5',
  bg: '#F8F9FA',
  orange: '#F59E0B',
  red: '#DC2626',
  blue: '#3B82F6',
  white: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  skin: '#FBBF24',
  skinLight: '#FDE68A',
};

interface IllustrationProps {
  size?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── 1. Splash Illustration ───────────────────────────────────────────────────

export const SplashIllustration: React.FC<IllustrationProps> = ({
  size = 200,
}) => {
  const s = size / 200;
  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessibilityLabel="Amrutam brand illustration"
    >
      {/* Stem */}
      <Rect w={4 * s} h={100 * s} color={C.primary} radius={2 * s} style={{ position: 'absolute', bottom: 20 * s, left: (size - 4 * s) / 2 }} />
      {/* Bottom leaf left */}
      <View style={{ position: 'absolute', bottom: 40 * s, left: 60 * s, transform: [{ rotate: '-30deg' }] }}>
        <Rect w={50 * s} h={24 * s} color={C.primaryLight} radius={12 * s} />
      </View>
      {/* Bottom leaf right */}
      <View style={{ position: 'absolute', bottom: 50 * s, right: 60 * s, transform: [{ rotate: '30deg' }] }}>
        <Rect w={50 * s} h={24 * s} color={C.primary} radius={12 * s} />
      </View>
      {/* Mid leaf left */}
      <View style={{ position: 'absolute', bottom: 80 * s, left: 50 * s, transform: [{ rotate: '-20deg' }] }}>
        <Rect w={55 * s} h={26 * s} color={C.primary} radius={13 * s} />
      </View>
      {/* Mid leaf right */}
      <View style={{ position: 'absolute', bottom: 90 * s, right: 50 * s, transform: [{ rotate: '20deg' }] }}>
        <Rect w={55 * s} h={26 * s} color={C.primaryLight} radius={13 * s} />
      </View>
      {/* Top leaf left */}
      <View style={{ position: 'absolute', bottom: 120 * s, left: 55 * s, transform: [{ rotate: '-15deg' }] }}>
        <Rect w={45 * s} h={22 * s} color={C.primaryLight} radius={11 * s} />
      </View>
      {/* Top leaf right */}
      <View style={{ position: 'absolute', bottom: 128 * s, right: 55 * s, transform: [{ rotate: '15deg' }] }}>
        <Rect w={45 * s} h={22 * s} color={C.primary} radius={11 * s} />
      </View>
      {/* Berries */}
      <Dot size={10 * s} color={C.orange} style={{ position: 'absolute', top: 30 * s, left: 70 * s }} />
      <Dot size={8 * s} color={C.red} style={{ position: 'absolute', top: 22 * s, right: 72 * s }} />
      <Dot size={12 * s} color={C.orange} style={{ position: 'absolute', top: 18 * s, left: (size - 6 * s) / 2 }} />
      <Dot size={6 * s} color={C.primaryLight} style={{ position: 'absolute', top: 38 * s, left: 85 * s }} />
      <Dot size={6 * s} color={C.primaryLight} style={{ position: 'absolute', top: 34 * s, right: 85 * s }} />
    </View>
  );
};

// ─── 2. Onboarding Illustration ───────────────────────────────────────────────

export const OnboardingIllustration: React.FC<IllustrationProps> = ({
  size = 200,
}) => {
  const s = size / 200;
  return (
    <View style={[styles.container, { width: size, height: size }]} accessibilityLabel="Meditation illustration">
      {/* Lotus base */}
      <View style={{ position: 'absolute', bottom: 18 * s, left: (size - 60 * s) / 2 }}>
        <Rect w={60 * s} h={16 * s} color={C.primarySoft} radius={8 * s} />
      </View>
      {/* Lotus petals */}
      <View style={{ position: 'absolute', bottom: 28 * s, left: (size - 50 * s) / 2, transform: [{ rotate: '-20deg' }] }}>
        <Rect w={24 * s} h={14 * s} color={C.primaryLight} radius={7 * s} />
      </View>
      <View style={{ position: 'absolute', bottom: 28 * s, left: (size - 24 * s) / 2 }}>
        <Rect w={24 * s} h={16 * s} color={C.primary} radius={8 * s} />
      </View>
      <View style={{ position: 'absolute', bottom: 28 * s, left: (size + 26 * s) / 2, transform: [{ rotate: '20deg' }] }}>
        <Rect w={24 * s} h={14 * s} color={C.primaryLight} radius={7 * s} />
      </View>
      {/* Crossed legs */}
      <View style={{ position: 'absolute', bottom: 36 * s, left: (size - 56 * s) / 2 }}>
        <Rect w={56 * s} h={14 * s} color={C.primary} radius={7 * s} />
      </View>
      {/* Body/triangle */}
      <View style={{ position: 'absolute', bottom: 48 * s, left: (size - 48 * s) / 2 }}>
        <View style={{ width: 0, height: 0, borderLeftWidth: 24 * s, borderRightWidth: 24 * s, borderBottomWidth: 44 * s, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: C.primaryLight }} />
      </View>
      {/* Arms resting on knees */}
      <View style={{ position: 'absolute', bottom: 54 * s, left: (size - 70 * s) / 2, transform: [{ rotate: '60deg' }] }}>
        <Rect w={30 * s} h={6 * s} color={C.primaryLight} radius={3 * s} />
      </View>
      <View style={{ position: 'absolute', bottom: 54 * s, left: (size + 40 * s) / 2, transform: [{ rotate: '-60deg' }] }}>
        <Rect w={30 * s} h={6 * s} color={C.primaryLight} radius={3 * s} />
      </View>
      {/* Head */}
      <Circle size={36 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 92 * s, left: (size - 36 * s) / 2 }} />
      {/* Eyes (closed, serene) */}
      <View style={{ position: 'absolute', bottom: 106 * s, left: (size - 14 * s) / 2 }}>
        <Rect w={6 * s} h={2 * s} color={C.text} radius={1 * s} />
      </View>
      <View style={{ position: 'absolute', bottom: 106 * s, left: (size + 8 * s) / 2 }}>
        <Rect w={6 * s} h={2 * s} color={C.text} radius={1 * s} />
      </View>
      {/* Gentle smile */}
      <View style={{ position: 'absolute', bottom: 98 * s, left: (size - 10 * s) / 2 }}>
        <Rect w={10 * s} h={2 * s} color={C.text} radius={1 * s} />
      </View>
      {/* Small leaf floating */}
      <View style={{ position: 'absolute', top: 30 * s, right: 30 * s, transform: [{ rotate: '25deg' }] }}>
        <Rect w={18 * s} h={10 * s} color={C.primaryLight} radius={5 * s} />
      </View>
      {/* Sparkle */}
      <Dot size={6 * s} color={C.orange} style={{ position: 'absolute', top: 40 * s, left: 35 * s }} />
    </View>
  );
};

// ─── 3. Doctor Illustration ───────────────────────────────────────────────────

export const DoctorIllustration: React.FC<IllustrationProps> = ({
  size = 200,
}) => {
  const s = size / 200;
  return (
    <View style={[styles.container, { width: size, height: size }]} accessibilityLabel="Doctor illustration">
      {/* Body / white coat */}
      <Rect w={56 * s} h={60 * s} color={C.white} radius={8 * s} style={{ position: 'absolute', bottom: 20 * s, left: (size - 56 * s) / 2 }} />
      {/* Green undershirt visible at collar */}
      <Rect w={20 * s} h={10 * s} color={C.primary} radius={4 * s} style={{ position: 'absolute', bottom: 72 * s, left: (size - 20 * s) / 2 }} />
      {/* Arms */}
      <Rect w={14 * s} h={40 * s} color={C.white} radius={7 * s} style={{ position: 'absolute', bottom: 28 * s, left: (size - 72 * s) / 2 }} />
      <Rect w={14 * s} h={40 * s} color={C.white} radius={7 * s} style={{ position: 'absolute', bottom: 28 * s, left: (size + 58 * s) / 2 }} />
      {/* Hands */}
      <Circle size={12 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 20 * s, left: (size - 72 * s) / 2 + 1 * s }} />
      <Circle size={12 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 20 * s, left: (size + 58 * s) / 2 + 1 * s }} />
      {/* Stethoscope */}
      <View style={{ position: 'absolute', bottom: 64 * s, left: (size - 4 * s) / 2 }}>
        <Rect w={4 * s} h={24 * s} color={C.textSecondary} radius={2 * s} />
      </View>
      <Circle size={10 * s} color={C.textSecondary} style={{ position: 'absolute', bottom: 58 * s, left: (size - 10 * s) / 2 }} />
      {/* Head */}
      <Circle size={42 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 80 * s, left: (size - 42 * s) / 2 }} />
      {/* Hair */}
      <View style={{ position: 'absolute', bottom: 114 * s, left: (size - 36 * s) / 2 }}>
        <Rect w={36 * s} h={14 * s} color={C.text} radius={7 * s} />
      </View>
      {/* Eyes */}
      <Dot size={5 * s} color={C.text} style={{ position: 'absolute', bottom: 100 * s, left: (size - 14 * s) / 2 }} />
      <Dot size={5 * s} color={C.text} style={{ position: 'absolute', bottom: 100 * s, left: (size + 9 * s) / 2 }} />
      {/* Smile */}
      <View style={{ position: 'absolute', bottom: 90 * s, left: (size - 10 * s) / 2 }}>
        <Rect w={10 * s} h={2 * s} color={C.primary} radius={1 * s} />
      </View>
      {/* Stethoscope earpieces */}
      <View style={{ position: 'absolute', bottom: 110 * s, left: (size - 20 * s) / 2, transform: [{ rotate: '-15deg' }] }}>
        <Rect w={3 * s} h={14 * s} color={C.textSecondary} radius={1.5 * s} />
      </View>
      <View style={{ position: 'absolute', bottom: 110 * s, left: (size + 17 * s) / 2, transform: [{ rotate: '15deg' }] }}>
        <Rect w={3 * s} h={14 * s} color={C.textSecondary} radius={1.5 * s} />
      </View>
    </View>
  );
};

// ─── 4. Shopping Illustration ─────────────────────────────────────────────────

export const ShoppingIllustration: React.FC<IllustrationProps> = ({
  size = 200,
}) => {
  const s = size / 200;
  return (
    <View style={[styles.container, { width: size, height: size }]} accessibilityLabel="Shopping illustration">
      {/* Body */}
      <Rect w={48 * s} h={50 * s} color={C.primary} radius={8 * s} style={{ position: 'absolute', bottom: 24 * s, left: (size - 48 * s) / 2 }} />
      {/* Arms */}
      <Rect w={12 * s} h={36 * s} color={C.skinLight} radius={6 * s} style={{ position: 'absolute', bottom: 30 * s, left: (size - 64 * s) / 2, transform: [{ rotate: '10deg' }] }} />
      <Rect w={12 * s} h={36 * s} color={C.skinLight} radius={6 * s} style={{ position: 'absolute', bottom: 30 * s, left: (size + 52 * s) / 2, transform: [{ rotate: '-10deg' }] }} />
      {/* Left bag */}
      <View style={{ position: 'absolute', bottom: 30 * s, left: (size - 90 * s) / 2 }}>
        <Rect w={28 * s} h={32 * s} color={C.orange} radius={4 * s} />
        {/* Bag handle */}
        <View style={{ position: 'absolute', top: -8 * s, left: 6 * s }}>
          <Rect w={16 * s} h={10 * s} color={C.orange} radius={5 * s} />
        </View>
      </View>
      {/* Right bag */}
      <View style={{ position: 'absolute', bottom: 26 * s, left: (size + 62 * s) / 2 }}>
        <Rect w={26 * s} h={30 * s} color={C.primaryLight} radius={4 * s} />
        <View style={{ position: 'absolute', top: -8 * s, left: 5 * s }}>
          <Rect w={14 * s} h={10 * s} color={C.primaryLight} radius={5 * s} />
        </View>
      </View>
      {/* Head */}
      <Circle size={40 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 74 * s, left: (size - 40 * s) / 2 }} />
      {/* Hair */}
      <View style={{ position: 'absolute', bottom: 106 * s, left: (size - 34 * s) / 2 }}>
        <Rect w={34 * s} h={14 * s} color={C.text} radius={7 * s} />
      </View>
      {/* Happy eyes */}
      <View style={{ position: 'absolute', bottom: 92 * s, left: (size - 12 * s) / 2 }}>
        <Rect w={5 * s} h={5 * s} color={C.text} radius={2.5 * s} />
      </View>
      <View style={{ position: 'absolute', bottom: 92 * s, left: (size + 7 * s) / 2 }}>
        <Rect w={5 * s} h={5 * s} color={C.text} radius={2.5 * s} />
      </View>
      {/* Big smile */}
      <View style={{ position: 'absolute', bottom: 82 * s, left: (size - 12 * s) / 2 }}>
        <Rect w={12 * s} h={3 * s} color={C.primary} radius={1.5 * s} />
      </View>
      {/* Small product items floating */}
      <Dot size={8 * s} color={C.primaryLight} style={{ position: 'absolute', top: 24 * s, left: 40 * s }} />
      <Dot size={6 * s} color={C.orange} style={{ position: 'absolute', top: 30 * s, right: 42 * s }} />
      <Dot size={10 * s} color={C.primarySoft} style={{ position: 'absolute', top: 18 * s, left: (size - 5 * s) / 2 }} />
    </View>
  );
};

// ─── 5. Success Illustration ──────────────────────────────────────────────────

export const SuccessIllustration: React.FC<IllustrationProps> = ({
  size = 200,
}) => {
  const s = size / 200;
  return (
    <View style={[styles.container, { width: size, height: size }]} accessibilityLabel="Success celebration illustration">
      {/* Body */}
      <Rect w={48 * s} h={50 * s} color={C.primary} radius={8 * s} style={{ position: 'absolute', bottom: 22 * s, left: (size - 48 * s) / 2 }} />
      {/* Left arm raised */}
      <View style={{ position: 'absolute', bottom: 66 * s, left: (size - 70 * s) / 2, transform: [{ rotate: '-30deg' }] }}>
        <Rect w={10 * s} h={40 * s} color={C.skinLight} radius={5 * s} />
      </View>
      {/* Right arm raised */}
      <View style={{ position: 'absolute', bottom: 66 * s, left: (size + 60 * s) / 2, transform: [{ rotate: '30deg' }] }}>
        <Rect w={10 * s} h={40 * s} color={C.skinLight} radius={5 * s} />
      </View>
      {/* Hands */}
      <Circle size={12 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 100 * s, left: (size - 72 * s) / 2 }} />
      <Circle size={12 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 100 * s, left: (size + 60 * s) / 2 }} />
      {/* Head */}
      <Circle size={40 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 72 * s, left: (size - 40 * s) / 2 }} />
      {/* Happy eyes (curved up) */}
      <View style={{ position: 'absolute', bottom: 90 * s, left: (size - 12 * s) / 2, transform: [{ rotate: '10deg' }] }}>
        <Rect w={6 * s} h={2 * s} color={C.text} radius={1 * s} />
      </View>
      <View style={{ position: 'absolute', bottom: 90 * s, left: (size + 6 * s) / 2, transform: [{ rotate: '-10deg' }] }}>
        <Rect w={6 * s} h={2 * s} color={C.text} radius={1 * s} />
      </View>
      {/* Big smile */}
      <View style={{ position: 'absolute', bottom: 80 * s, left: (size - 14 * s) / 2 }}>
        <Rect w={14 * s} h={3 * s} color={C.primary} radius={1.5 * s} />
      </View>
      {/* Confetti dots */}
      <Dot size={8 * s} color={C.orange} style={{ position: 'absolute', top: 20 * s, left: 30 * s }} />
      <Dot size={6 * s} color={C.blue} style={{ position: 'absolute', top: 16 * s, right: 35 * s }} />
      <Dot size={10 * s} color={C.primaryLight} style={{ position: 'absolute', top: 28 * s, left: 55 * s }} />
      <Dot size={7 * s} color={C.red} style={{ position: 'absolute', top: 12 * s, left: (size - 4 * s) / 2 }} />
      <Dot size={5 * s} color={C.orange} style={{ position: 'absolute', top: 32 * s, right: 50 * s }} />
      <Dot size={9 * s} color={C.blue} style={{ position: 'absolute', top: 22 * s, left: 80 * s }} />
      <Dot size={6 * s} color={C.primary} style={{ position: 'absolute', top: 14 * s, right: 60 * s }} />
      <Dot size={8 * s} color={C.primarySoft} style={{ position: 'absolute', top: 36 * s, left: 40 * s }} />
    </View>
  );
};

// ─── 6. Error Illustration ────────────────────────────────────────────────────

export const ErrorIllustration: React.FC<IllustrationProps> = ({
  size = 200,
}) => {
  const s = size / 200;
  return (
    <View style={[styles.container, { width: size, height: size }]} accessibilityLabel="Error state illustration">
      {/* Body */}
      <Rect w={48 * s} h={50 * s} color={C.textSecondary} radius={8 * s} style={{ position: 'absolute', bottom: 22 * s, left: (size - 48 * s) / 2 }} />
      {/* Arms down */}
      <Rect w={12 * s} h={34 * s} color={C.skinLight} radius={6 * s} style={{ position: 'absolute', bottom: 28 * s, left: (size - 64 * s) / 2 }} />
      <Rect w={12 * s} h={34 * s} color={C.skinLight} radius={6 * s} style={{ position: 'absolute', bottom: 28 * s, left: (size + 52 * s) / 2 }} />
      {/* Hands on cheeks */}
      <Circle size={14 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 60 * s, left: (size - 68 * s) / 2 }} />
      <Circle size={14 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 60 * s, left: (size + 54 * s) / 2 }} />
      {/* Head */}
      <Circle size={42 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 72 * s, left: (size - 42 * s) / 2 }} />
      {/* Surprised eyes (wide) */}
      <Circle size={8 * s} color={C.white} style={{ position: 'absolute', bottom: 90 * s, left: (size - 18 * s) / 2 }} />
      <Dot size={4 * s} color={C.text} style={{ position: 'absolute', bottom: 92 * s, left: (size - 12 * s) / 2 }} />
      <Circle size={8 * s} color={C.white} style={{ position: 'absolute', bottom: 90 * s, left: (size + 10 * s) / 2 }} />
      <Dot size={4 * s} color={C.text} style={{ position: 'absolute', bottom: 92 * s, left: (size + 16 * s) / 2 }} />
      {/* O mouth */}
      <Circle size={10 * s} color={C.red} style={{ position: 'absolute', bottom: 78 * s, left: (size - 10 * s) / 2 }} />
      <Circle size={6 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 80 * s, left: (size - 6 * s) / 2 }} />
      {/* Sweat drops */}
      <View style={{ position: 'absolute', top: 28 * s, right: 48 * s, transform: [{ rotate: '15deg' }] }}>
        <Rect w={4 * s} h={10 * s} color={C.blue} radius={2 * s} />
      </View>
      <View style={{ position: 'absolute', top: 36 * s, right: 56 * s, transform: [{ rotate: '10deg' }] }}>
        <Rect w={3 * s} h={8 * s} color={C.blue} radius={1.5 * s} />
      </View>
      {/* Raised eyebrows */}
      <View style={{ position: 'absolute', bottom: 100 * s, left: (size - 14 * s) / 2, transform: [{ rotate: '-10deg' }] }}>
        <Rect w={8 * s} h={2 * s} color={C.text} radius={1 * s} />
      </View>
      <View style={{ position: 'absolute', bottom: 100 * s, left: (size + 6 * s) / 2, transform: [{ rotate: '10deg' }] }}>
        <Rect w={8 * s} h={2 * s} color={C.text} radius={1 * s} />
      </View>
    </View>
  );
};

// ─── 7. Empty Cart Illustration ───────────────────────────────────────────────

export const EmptyCartIllustration: React.FC<IllustrationProps> = ({
  size = 200,
}) => {
  const s = size / 200;
  return (
    <View style={[styles.container, { width: size, height: size }]} accessibilityLabel="Empty cart illustration">
      {/* Body */}
      <Rect w={44 * s} h={48 * s} color={C.primaryLight} radius={8 * s} style={{ position: 'absolute', bottom: 22 * s, left: (size - 44 * s) / 2 }} />
      {/* Arms holding bag */}
      <Rect w={10 * s} h={30 * s} color={C.skinLight} radius={5 * s} style={{ position: 'absolute', bottom: 34 * s, left: (size - 56 * s) / 2, transform: [{ rotate: '15deg' }] }} />
      <Rect w={10 * s} h={30 * s} color={C.skinLight} radius={5 * s} style={{ position: 'absolute', bottom: 34 * s, left: (size + 46 * s) / 2, transform: [{ rotate: '-15deg' }] }} />
      {/* Open bag */}
      <View style={{ position: 'absolute', bottom: 24 * s, left: (size - 40 * s) / 2 }}>
        <Rect w={40 * s} h={36 * s} color={C.orange} radius={4 * s} />
        {/* Bag opening */}
        <View style={{ position: 'absolute', top: -4 * s, left: 4 * s }}>
          <Rect w={32 * s} h={8 * s} color={C.skinLight} radius={2 * s} />
        </View>
      </View>
      {/* Empty dots inside bag */}
      <Dot size={5 * s} color={C.textSecondary} style={{ position: 'absolute', bottom: 40 * s, left: (size - 10 * s) / 2 }} />
      <Dot size={4 * s} color={C.textSecondary} style={{ position: 'absolute', bottom: 36 * s, left: (size - 2 * s) / 2 }} />
      <Dot size={3 * s} color={C.textSecondary} style={{ position: 'absolute', bottom: 44 * s, left: (size + 6 * s) / 2 }} />
      {/* Head */}
      <Circle size={38 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 70 * s, left: (size - 38 * s) / 2 }} />
      {/* Hair */}
      <View style={{ position: 'absolute', bottom: 100 * s, left: (size - 32 * s) / 2 }}>
        <Rect w={32 * s} h={12 * s} color={C.text} radius={6 * s} />
      </View>
      {/* Neutral eyes */}
      <Dot size={5 * s} color={C.text} style={{ position: 'absolute', bottom: 88 * s, left: (size - 12 * s) / 2 }} />
      <Dot size={5 * s} color={C.text} style={{ position: 'absolute', bottom: 88 * s, left: (size + 7 * s) / 2 }} />
      {/* Slight frown */}
      <View style={{ position: 'absolute', bottom: 78 * s, left: (size - 8 * s) / 2, transform: [{ rotate: '180deg' }] }}>
        <Rect w={8 * s} h={2 * s} color={C.textSecondary} radius={1 * s} />
      </View>
    </View>
  );
};

// ─── 8. Offline Illustration ──────────────────────────────────────────────────

export const OfflineIllustration: React.FC<IllustrationProps> = ({
  size = 200,
}) => {
  const s = size / 200;
  return (
    <View style={[styles.container, { width: size, height: size }]} accessibilityLabel="Offline state illustration">
      {/* Body */}
      <Rect w={44 * s} h={46 * s} color={C.textSecondary} radius={8 * s} style={{ position: 'absolute', bottom: 22 * s, left: (size - 44 * s) / 2 }} />
      {/* Arms */}
      <Rect w={10 * s} h={30 * s} color={C.skinLight} radius={5 * s} style={{ position: 'absolute', bottom: 30 * s, left: (size - 56 * s) / 2 }} />
      <Rect w={10 * s} h={30 * s} color={C.skinLight} radius={5 * s} style={{ position: 'absolute', bottom: 30 * s, left: (size + 46 * s) / 2 }} />
      {/* Hands */}
      <Circle size={10 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 24 * s, left: (size - 56 * s) / 2 }} />
      <Circle size={10 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 24 * s, left: (size + 46 * s) / 2 }} />
      {/* Head */}
      <Circle size={40 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 68 * s, left: (size - 40 * s) / 2 }} />
      {/* Hair */}
      <View style={{ position: 'absolute', bottom: 98 * s, left: (size - 34 * s) / 2 }}>
        <Rect w={34 * s} h={12 * s} color={C.text} radius={6 * s} />
      </View>
      {/* Confused eyes */}
      <Dot size={5 * s} color={C.text} style={{ position: 'absolute', bottom: 86 * s, left: (size - 12 * s) / 2 }} />
      <Dot size={5 * s} color={C.text} style={{ position: 'absolute', bottom: 86 * s, left: (size + 7 * s) / 2 }} />
      {/* Confused mouth */}
      <View style={{ position: 'absolute', bottom: 76 * s, left: (size - 6 * s) / 2, transform: [{ rotate: '5deg' }] }}>
        <Rect w={8 * s} h={2 * s} color={C.textSecondary} radius={1 * s} />
      </View>
      {/* Wifi symbol with X */}
      <View style={{ position: 'absolute', top: 22 * s, left: (size - 24 * s) / 2 }}>
        {/* Wifi arcs */}
        <View style={{ position: 'absolute', bottom: 16 * s, left: 8 * s }}>
          <Circle size={8 * s} color={C.textSecondary} />
        </View>
        <View style={{ position: 'absolute', bottom: 10 * s, left: 3 * s }}>
          <Rect w={18 * s} h={3 * s} color={C.textSecondary} radius={1.5 * s} />
        </View>
        <View style={{ position: 'absolute', bottom: 4 * s, left: -2 * s }}>
          <Rect w={28 * s} h={3 * s} color={C.textSecondary} radius={1.5 * s} />
        </View>
        {/* X mark */}
        <View style={{ position: 'absolute', bottom: 8 * s, left: 6 * s, transform: [{ rotate: '45deg' }] }}>
          <Rect w={16 * s} h={3 * s} color={C.red} radius={1.5 * s} />
        </View>
        <View style={{ position: 'absolute', bottom: 8 * s, left: 6 * s, transform: [{ rotate: '-45deg' }] }}>
          <Rect w={16 * s} h={3 * s} color={C.red} radius={1.5 * s} />
        </View>
      </View>
    </View>
  );
};

// ─── 9. Booking Confirmed Illustration ────────────────────────────────────────

export const BookingConfirmedIllustration: React.FC<IllustrationProps> = ({
  size = 200,
}) => {
  const s = size / 200;
  return (
    <View style={[styles.container, { width: size, height: size }]} accessibilityLabel="Booking confirmed illustration">
      {/* Body */}
      <Rect w={48 * s} h={50 * s} color={C.primary} radius={8 * s} style={{ position: 'absolute', bottom: 22 * s, left: (size - 48 * s) / 2 }} />
      {/* Left arm relaxed */}
      <Rect w={10 * s} h={32 * s} color={C.skinLight} radius={5 * s} style={{ position: 'absolute', bottom: 30 * s, left: (size - 60 * s) / 2, transform: [{ rotate: '8deg' }] }} />
      {/* Right arm thumbs up */}
      <View style={{ position: 'absolute', bottom: 60 * s, left: (size + 40 * s) / 2, transform: [{ rotate: '-20deg' }] }}>
        <Rect w={10 * s} h={36 * s} color={C.skinLight} radius={5 * s} />
      </View>
      {/* Thumb */}
      <View style={{ position: 'absolute', bottom: 92 * s, left: (size + 42 * s) / 2 }}>
        <Rect w={8 * s} h={14 * s} color={C.skinLight} radius={4 * s} />
      </View>
      {/* Fist */}
      <Circle size={12 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 86 * s, left: (size + 40 * s) / 2 }} />
      {/* Head */}
      <Circle size={40 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 72 * s, left: (size - 40 * s) / 2 }} />
      {/* Hair */}
      <View style={{ position: 'absolute', bottom: 102 * s, left: (size - 34 * s) / 2 }}>
        <Rect w={34 * s} h={12 * s} color={C.text} radius={6 * s} />
      </View>
      {/* Happy eyes */}
      <View style={{ position: 'absolute', bottom: 90 * s, left: (size - 12 * s) / 2, transform: [{ rotate: '8deg' }] }}>
        <Rect w={6 * s} h={2 * s} color={C.text} radius={1 * s} />
      </View>
      <View style={{ position: 'absolute', bottom: 90 * s, left: (size + 6 * s) / 2, transform: [{ rotate: '-8deg' }] }}>
        <Rect w={6 * s} h={2 * s} color={C.text} radius={1 * s} />
      </View>
      {/* Smile */}
      <View style={{ position: 'absolute', bottom: 80 * s, left: (size - 10 * s) / 2 }}>
        <Rect w={10 * s} h={2 * s} color={C.primaryLight} radius={1 * s} />
      </View>
      {/* Sparkles */}
      <View style={{ position: 'absolute', top: 20 * s, right: 30 * s }}>
        <Rect w={2 * s} h={10 * s} color={C.orange} radius={1 * s} />
        <View style={{ position: 'absolute', top: 4 * s, left: -4 * s }}>
          <Rect w={10 * s} h={2 * s} color={C.orange} radius={1 * s} />
        </View>
      </View>
      <View style={{ position: 'absolute', top: 32 * s, left: 35 * s }}>
        <Rect w={2 * s} h={8 * s} color={C.primaryLight} radius={1 * s} />
        <View style={{ position: 'absolute', top: 3 * s, left: -3 * s }}>
          <Rect w={8 * s} h={2 * s} color={C.primaryLight} radius={1 * s} />
        </View>
      </View>
      <Dot size={6 * s} color={C.blue} style={{ position: 'absolute', top: 26 * s, left: (size - 3 * s) / 2 }} />
      <Dot size={5 * s} color={C.orange} style={{ position: 'absolute', top: 38 * s, right: 44 * s }} />
    </View>
  );
};

// ─── 10. Cancelled Illustration ───────────────────────────────────────────────

export const CancelledIllustration: React.FC<IllustrationProps> = ({
  size = 200,
}) => {
  const s = size / 200;
  return (
    <View style={[styles.container, { width: size, height: size }]} accessibilityLabel="Cancelled illustration">
      {/* Body */}
      <Rect w={44 * s} h={46 * s} color={C.textSecondary} radius={8 * s} style={{ position: 'absolute', bottom: 22 * s, left: (size - 44 * s) / 2 }} />
      {/* Left arm relaxed */}
      <Rect w={10 * s} h={30 * s} color={C.skinLight} radius={5 * s} style={{ position: 'absolute', bottom: 30 * s, left: (size - 56 * s) / 2 }} />
      {/* Right arm waving */}
      <View style={{ position: 'absolute', bottom: 56 * s, left: (size + 38 * s) / 2, transform: [{ rotate: '-35deg' }] }}>
        <Rect w={10 * s} h={34 * s} color={C.skinLight} radius={5 * s} />
      </View>
      {/* Hand waving */}
      <Circle size={12 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 84 * s, left: (size + 42 * s) / 2 }} />
      {/* Fingers waving */}
      <View style={{ position: 'absolute', bottom: 94 * s, left: (size + 44 * s) / 2, transform: [{ rotate: '10deg' }] }}>
        <Rect w={3 * s} h={8 * s} color={C.skinLight} radius={1.5 * s} />
      </View>
      <View style={{ position: 'absolute', bottom: 96 * s, left: (size + 48 * s) / 2, transform: [{ rotate: '5deg' }] }}>
        <Rect w={3 * s} h={10 * s} color={C.skinLight} radius={1.5 * s} />
      </View>
      <View style={{ position: 'absolute', bottom: 96 * s, left: (size + 52 * s) / 2, transform: [{ rotate: '-5deg' }] }}>
        <Rect w={3 * s} h={10 * s} color={C.skinLight} radius={1.5 * s} />
      </View>
      {/* Head */}
      <Circle size={38 * s} color={C.skinLight} style={{ position: 'absolute', bottom: 68 * s, left: (size - 38 * s) / 2 }} />
      {/* Hair */}
      <View style={{ position: 'absolute', bottom: 98 * s, left: (size - 32 * s) / 2 }}>
        <Rect w={32 * s} h={12 * s} color={C.text} radius={6 * s} />
      </View>
      {/* Gentle eyes */}
      <Dot size={5 * s} color={C.text} style={{ position: 'absolute', bottom: 86 * s, left: (size - 10 * s) / 2 }} />
      <Dot size={5 * s} color={C.text} style={{ position: 'absolute', bottom: 86 * s, left: (size + 5 * s) / 2 }} />
      {/* Gentle smile */}
      <View style={{ position: 'absolute', bottom: 76 * s, left: (size - 8 * s) / 2 }}>
        <Rect w={8 * s} h={2 * s} color={C.textSecondary} radius={1 * s} />
      </View>
      {/* Soft motion lines near hand */}
      <View style={{ position: 'absolute', bottom: 90 * s, left: (size + 56 * s) / 2 }}>
        <Rect w={6 * s} h={2 * s} color={C.textSecondary} radius={1 * s} />
      </View>
      <View style={{ position: 'absolute', bottom: 84 * s, left: (size + 58 * s) / 2 }}>
        <Rect w={5 * s} h={2 * s} color={C.textSecondary} radius={1 * s} />
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
