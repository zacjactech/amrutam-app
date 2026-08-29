// Responsive Authentication Layout
// Handles keyboard, safe area, and responsive vertical positioning

import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useThemeColors } from '../../../shared/components/ThemeProvider';

const STATUSBAR_HEIGHT = StatusBar.currentHeight ?? 0;

interface AuthLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ children, footer }: AuthLayoutProps): React.JSX.Element {
  const colors = useThemeColors();

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={STATUSBAR_HEIGHT}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="interactive"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.spacerTop} />
        <View style={styles.content}>
          {children}
        </View>
        {footer !== undefined && (
          <View style={styles.footer}>
            {footer}
          </View>
        )}
        <View style={styles.spacerBottom} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  spacerTop: {
    height: 48,
  },
  content: {
    gap: 0,
  },
  footer: {
    marginTop: 24,
    gap: 12,
  },
  spacerBottom: {
    height: 24,
  },
});
