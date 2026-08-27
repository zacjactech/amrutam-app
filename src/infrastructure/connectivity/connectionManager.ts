// Connectivity Layer - NetInfo wrapper

import { NetInfoState, NetInfoStateType, addEventListener } from '@react-native-community/netinfo';
import { useSyncExternalStore } from 'react';

type ConnectionStatus = 'online' | 'offline' | 'unknown';

type ConnectionInfo = {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: NetInfoStateType | null;
  status: ConnectionStatus;
};

let cachedState: ConnectionInfo = {
  isConnected: false,
  isInternetReachable: null,
  type: null,
  status: 'unknown',
};

const listeners = new Set<() => void>();

function updateState(state: NetInfoState): void {
  const isConnected = state.isConnected ?? false;
  const isInternetReachable = state.isInternetReachable;
  const status: ConnectionStatus = isConnected ? 'online' : 'offline';

  cachedState = {
    isConnected,
    isInternetReachable,
    type: state.type,
    status,
  };

  listeners.forEach((listener) => listener());
}

export function getConnectionInfo(): ConnectionInfo {
  return cachedState;
}

export function subscribeToConnection(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export async function initializeConnectivity(): Promise<(() => void) | void> {
  const unsubscribe = addEventListener((state) => {
    updateState(state);
  });

  return unsubscribe;
}

export function useConnectionStatus(): ConnectionInfo {
  return useSyncExternalStore(subscribeToConnection, getConnectionInfo);
}

export function useIsOnline(): boolean {
  const { isConnected } = useConnectionStatus();
  return isConnected;
}
