// Application Error Boundary

import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { logger } from '../../infrastructure/logging/logger';
import { useThemeColors, useThemeTypography } from './ThemeProvider';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error('Uncaught error in component tree', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack ?? undefined,
    });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorBoundaryContent
          error={this.state.error}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

function ErrorBoundaryContent({
  error,
  onReset,
}: {
  error: Error | null;
  onReset: () => void;
}): React.JSX.Element {
  const colors = useThemeColors();
  const typography = useThemeTypography();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Text style={[styles.title, { color: colors.text.primary, ...typography.h2 }]}>
        Something went wrong
      </Text>
      <Text style={[styles.message, { color: colors.text.secondary, ...typography.body }]}>
        {error !== null ? error.message : 'An unexpected error occurred'}
      </Text>
      <Button title="Try Again" onPress={onReset} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
  },
});
