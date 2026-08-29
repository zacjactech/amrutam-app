// Root Application Component

// Validate env vars before anything else imports them
import '../infrastructure/env';

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';
import { QueryClient } from '@tanstack/react-query';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { ThemeProvider } from '../shared/components/ThemeProvider';
import { ToastProvider } from '../shared/components/Toast';
import { AuthProvider } from '../infrastructure/auth/AuthContext';
import { Navigation } from '../navigation/Navigation';
import { startSyncScheduler, stopSyncScheduler } from '../infrastructure/sync/syncScheduler';
import { SyncStatusProvider } from '../infrastructure/sync/SyncStatusContext';
import { initializeConnectivity } from '../infrastructure/connectivity/connectionManager';
import { useToast } from '../shared/components/Toast';
import { setShopErrorHandler } from '../features/shop/hooks';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function SyncSchedulerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let unsubConnectivity: (() => void) | undefined;
    initializeConnectivity().then((unsub) => {
      if (typeof unsub === 'function') {
        unsubConnectivity = unsub;
      }
    });
    startSyncScheduler();
    return () => {
      stopSyncScheduler();
      unsubConnectivity?.();
    };
  }, []);

  return <>{children}</>;
}

/** Bridges the shop mutation error handler to the Toast system */
function ShopErrorBridge(): null {
  const { showToast } = useToast();
  useEffect(() => {
    setShopErrorHandler((message) => showToast(message, 'error'));
  }, [showToast]);
  return null;
}

export default function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SyncStatusProvider>
          <SyncSchedulerProvider>
            <ThemeProvider>
              <ErrorBoundary>
                <ToastProvider>
                  <ShopErrorBridge />
                  <Navigation />
                  <StatusBar style="auto" />
                </ToastProvider>
              </ErrorBoundary>
            </ThemeProvider>
          </SyncSchedulerProvider>
        </SyncStatusProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
