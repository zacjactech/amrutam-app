// Modal - Centered dialog modal

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Modal as RNModal,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  style?: ViewStyle;
}

export function Modal({
  visible,
  onClose,
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
  style,
}: ModalProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 20,
          stiffness: 200,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, overlayOpacity]);

  const handleClose = (): void => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <RNModal transparent visible={visible} onRequestClose={handleClose} animationType="none">
      <View style={styles.wrapper}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            style={[
              styles.overlay,
              { backgroundColor: colors.overlay, opacity: overlayOpacity },
            ]}
          />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.card,
              style,
              {
                backgroundColor: colors.surface.default,
                borderRadius: 16,
                transform: [{ scale: scaleAnim }],
                paddingHorizontal: spacing.xxl,
                paddingTop: spacing.xxl,
                paddingBottom: spacing.lg,
              },
            ]}
          >
            {icon !== undefined && <View style={[styles.iconContainer, { marginBottom: spacing.md }]}>{icon}</View>}
            <Text style={[styles.title, { color: colors.text.primary, marginBottom: spacing.sm }]}>
              {title}
            </Text>
            {description !== undefined && (
              <Text style={[styles.description, { color: colors.text.secondary, marginBottom: spacing.xl }]}>
                {description}
              </Text>
            )}
            {(primaryAction !== undefined || secondaryAction !== undefined) && (
              <View style={styles.actions}>
                {secondaryAction !== undefined && secondaryAction}
                {primaryAction !== undefined && primaryAction}
              </View>
            )}
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    width: '80%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});
