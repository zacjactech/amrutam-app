// Entrance Animation Hook
// Provides smooth fade-in + scale-up for icons and slide-up + fade-in for buttons.
// Respects prefers-reduced-motion: when enabled, elements appear immediately.

import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, AccessibilityInfo } from 'react-native';

interface EntranceAnimationConfig {
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Duration of the animation (ms) */
  duration?: number;
}

/**
 * Hook that returns true when the user has enabled "Reduce Motion"
 * in their device accessibility settings.
 */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setReduced(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        if (mounted) setReduced(enabled);
      },
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}

/**
 * Fade-in + scale-up animation for icons/images.
 * Starts at scale 0.6 + opacity 0, animates to scale 1 + opacity 1.
 * When reduce motion is enabled, appears immediately at final state.
 */
export function useIconEntrance(config?: EntranceAnimationConfig) {
  const reducedMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(reducedMotion ? 1 : 0.6)).current;

  useEffect(() => {
    if (reducedMotion) return;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: config?.duration ?? 500,
        delay: config?.delay ?? 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        damping: 12,
        stiffness: 100,
        mass: 0.8,
        delay: config?.delay ?? 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale, reducedMotion, config?.delay, config?.duration]);

  return { opacity, transform: [{ scale }] };
}

/**
 * Slide-up + fade-in animation for buttons/CTAs.
 * Starts 16px below with opacity 0, slides to final position.
 * When reduce motion is enabled, appears immediately at final state.
 */
export function useButtonEntrance(config?: EntranceAnimationConfig) {
  const reducedMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(reducedMotion ? 0 : 16)).current;

  useEffect(() => {
    if (reducedMotion) return;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: config?.duration ?? 400,
        delay: config?.delay ?? 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: config?.duration ?? 400,
        delay: config?.delay ?? 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, reducedMotion, config?.delay, config?.duration]);

  return { opacity, transform: [{ translateY }] };
}

/**
 * Fade-in + slide-down animation for text content.
 * Starts 8px above with opacity 0, animates to final position.
 * When reduce motion is enabled, appears immediately at final state.
 */
export function useTextEntrance(config?: EntranceAnimationConfig) {
  const reducedMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(reducedMotion ? 0 : -8)).current;

  useEffect(() => {
    if (reducedMotion) return;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: config?.duration ?? 450,
        delay: config?.delay ?? 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: config?.duration ?? 450,
        delay: config?.delay ?? 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, reducedMotion, config?.delay, config?.duration]);

  return { opacity, transform: [{ translateY }] };
}
