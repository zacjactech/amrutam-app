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
    startSyncScheduler();
    return () => {
      stopSyncScheduler();
    };
  }, []);

  return <>{children}</>;
}

export default function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SyncStatusProvider>
          <SyncSchedulerProvider>
          <ThemeProvider>
            <ToastProvider>
              <Navigation />
              <StatusBar style="auto" />
            </ToastProvider>
          </ThemeProvider>
          </SyncSchedulerProvider>
          </SyncStatusProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
