// Performance Benchmark Utility

export interface BenchmarkResult {
  name: string;
  durationMs: number;
  iterations: number;
  averageMs: number;
  memoryUsedMB?: number | undefined;
}

export async function benchmark(name: string, fn: () => void | Promise<void>, iterations = 1): Promise<BenchmarkResult> {
  const startTime = Date.now();
  let memoryUsedMB: number | undefined;

  for (let i = 0; i < iterations; i++) {
    await fn();
  }

  const endTime = Date.now();
  const durationMs = endTime - startTime;

  if (typeof globalThis !== 'undefined' && 'memory' in globalThis) {
    const memory = (globalThis as unknown as { memory: { usedJSHeapSize: number } }).memory;
    memoryUsedMB = Math.round((memory.usedJSHeapSize / 1024 / 1024) * 100) / 100;
  }

  return {
    name,
    durationMs: Math.round(durationMs * 100) / 100,
    iterations,
    averageMs: Math.round((durationMs / iterations) * 100) / 100,
    memoryUsedMB,
  };
}

export function logBenchmark(result: BenchmarkResult): void {
  console.log(`[Benchmark] ${result.name}: ${result.durationMs}ms (${result.iterations} runs, avg ${result.averageMs}ms)`);
  if (result.memoryUsedMB !== undefined) {
    console.log(`[Benchmark] Memory: ${result.memoryUsedMB}MB`);
  }
}
