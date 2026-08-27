// Failure Injection - Deterministic mock failures for testing

export type FailureType = 'timeout' | 'server' | 'invalid-json' | 'empty' | 'partial' | 'session-expired';

export interface FailureConfig {
  type: FailureType;
  probability?: number;
  requestId?: string;
}

type FailureRule = {
  type: FailureType;
  predicate: (request: { endpoint: string; method: string; body?: unknown }) => boolean;
};

let activeRules: FailureRule[] = [];

export function enableFailure(config: FailureConfig): void {
  activeRules = [
    {
      type: config.type,
      predicate: () => true,
    },
  ];

  if (config.requestId) {
    activeRules = [
      {
        type: config.type,
        predicate: (request) => {
          const body = request.body as { requestId?: string } | undefined;
          return body?.requestId === config.requestId;
        },
      },
    ];
  }
}

export function disableFailure(): void {
  activeRules = [];
}

export function shouldFail(request: { endpoint: string; method: string; body?: unknown }): FailureType | null {
  for (const rule of activeRules) {
    if (rule.predicate(request)) {
      return rule.type;
    }
  }
  return null;
}

export function createFailureError(type: FailureType): Error {
  switch (type) {
    case 'timeout':
      return new Error('Request timed out');
    case 'server':
      return new Error('SERVER_ERROR: Internal server error');
    case 'invalid-json':
      return new Error('Invalid JSON response');
    case 'empty':
      return new Error('Empty response');
    case 'partial':
      return new Error('Partial response');
    case 'session-expired':
      return new Error('SESSION_EXPIRED: Session expired');
    default:
      return new Error('Unknown failure');
  }
}

export function isFailureEnabled(): boolean {
  return activeRules.length > 0;
}
