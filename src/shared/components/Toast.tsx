// Toast System - Notifications with colored icon circles

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { SuccessCheckCircle, CheckCircleFilled } from '../assets/icons';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_CONFIG: Record<ToastVariant, { bg: string; text: string; iconCircle: string }> = {
  success: { bg: '#D1FAE5', text: '#2D6A4F', iconCircle: '#2D6A4F' },
  error: { bg: '#FEE2E2', text: '#DC2626', iconCircle: '#DC2626' },
  warning: { bg: '#FEF3C7', text: '#F59E0B', iconCircle: '#F59E0B' },
  info: { bg: '#DBEAFE', text: '#3B82F6', iconCircle: '#3B82F6' },
};

const DEFAULT_DURATION = 3000;

export function ToastProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = DEFAULT_DURATION) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const newToast: ToastItem = { id, message, variant, duration };
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    [],
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.container}>
        {toasts.map((toast) => (
          <ToastMessage key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

function ToastIcon({ variant }: { variant: ToastVariant }): React.JSX.Element {
  switch (variant) {
    case 'success':
      return <SuccessCheckCircle width={18} height={18} color="#FFFFFF" />;
    case 'error':
      return <CheckCircleFilled width={18} height={18} color="#FFFFFF" />;
    case 'warning':
      return <Text style={styles.iconText}>!</Text>;
    case 'info':
    default:
      return <Text style={styles.iconText}>i</Text>;
  }
}

function ToastMessage({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}): React.JSX.Element {
  const config = TOAST_CONFIG[toast.variant];
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(-20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  const handleDismiss = (): void => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(toast.id);
    });
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        { backgroundColor: config.bg, opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: config.iconCircle }]}>
        <ToastIcon variant={toast.variant} />
      </View>
      <Text style={[styles.message, { color: config.text }]} numberOfLines={2}>
        {toast.message}
      </Text>
      <TouchableOpacity onPress={handleDismiss} style={styles.dismiss}>
        <Text style={[styles.dismissText, { color: config.text }]}>×</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  dismiss: {
    paddingLeft: 12,
  },
  dismissText: {
    fontSize: 20,
    fontWeight: '700',
  },
});
