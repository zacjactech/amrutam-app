// BottomSheet - Reusable bottom sheet modal

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';
import { useThemeColors, useThemeSpacing } from './ThemeProvider';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  bottomAction?: React.ReactNode;
  style?: ViewStyle;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.85;

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  bottomAction,
  style,
}: BottomSheetProps): React.JSX.Element {
  const colors = useThemeColors();
  const spacing = useThemeSpacing();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
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
  }, [visible, slideAnim, overlayOpacity]);

  const handleClose = (): void => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
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

  if (!visible) {
    return <View />;
  }

  return (
    <Modal transparent visible={visible} onRequestClose={handleClose} animationType="none">
      <View style={styles.wrapper}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            style={[
              styles.overlay,
              { backgroundColor: colors.overlay, opacity: overlayOpacity },
            ]}
          />
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          <Animated.View
            style={[
              styles.sheet,
              style,
              {
                backgroundColor: colors.surface.default,
                maxHeight: SHEET_MAX_HEIGHT,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={[styles.handleContainer, { paddingVertical: spacing.sm }]}>
              <View style={[styles.handle, { backgroundColor: colors.border.default }]} />
            </View>

            {title !== undefined && (
              <View style={[styles.header, { paddingHorizontal: spacing.lg, paddingBottom: spacing.md }]}>
                <Text style={[styles.title, { color: colors.text.primary }]}>
                  {title}
                </Text>
                <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={[styles.closeIcon, { color: colors.text.secondary }]}>✕</Text>
                </TouchableOpacity>
              </View>
            )}

            <ScrollView
              style={styles.contentArea}
              contentContainerStyle={[styles.contentContainer, { paddingHorizontal: spacing.lg }]}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>

            {bottomAction !== undefined && (
              <View style={[styles.bottomBar, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderTopColor: colors.border.default }]}>
                {bottomAction}
              </View>
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  keyboardAvoid: {
    justifyContent: 'flex-end',
  },
  sheet: {
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeIcon: {
    fontSize: 20,
    fontWeight: '600',
    padding: 4,
  },
  contentArea: {
    flexGrow: 0,
  },
  contentContainer: {
    paddingBottom: 8,
  },
  bottomBar: {
    borderTopWidth: 1,
  },
});
