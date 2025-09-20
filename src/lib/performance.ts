/**
 * Performance Monitoring and Optimization Utilities
 */

import { EventEmitter } from 'events';

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

interface PerformanceReport {
  totalDuration: number;
  metrics: PerformanceMetric[];
  slowestOperations: PerformanceMetric[];
  averageDuration: number;
}

class PerformanceMonitor extends EventEmitter {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private completedMetrics: PerformanceMetric[] = [];
  private readonly slowThreshold: number = 5000; // 5 seconds

  /**
   * Start timing an operation
   */
  start(name: string, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata,
    };
    this.metrics.set(name, metric);
    this.emit('metric:start', metric);
  }

  /**
   * End timing an operation
   */
  end(name: string): number {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`Performance metric "${name}" was not started`);
      return 0;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    
    this.metrics.delete(name);
    this.completedMetrics.push(metric);
    
    // Emit events
    this.emit('metric:end', metric);
    
    // Check if operation was slow
    if (metric.duration > this.slowThreshold) {
      this.emit('metric:slow', metric);
      console.warn(`⚠️ Slow operation detected: ${name} took ${metric.duration.toFixed(2)}ms`);
    }

    return metric.duration;
  }

  /**
   * Measure async function execution time
   */
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  /**
   * Get performance report
   */
  getReport(): PerformanceReport {
    const totalDuration = this.completedMetrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    const averageDuration = this.completedMetrics.length > 0 
      ? totalDuration / this.completedMetrics.length 
      : 0;
    
    const slowestOperations = [...this.completedMetrics]
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .slice(0, 10);

    return {
      totalDuration,
      metrics: this.completedMetrics,
      slowestOperations,
      averageDuration,
    };
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
    this.completedMetrics = [];
  }

  /**
   * Log performance report
   */
  logReport(): void {
    const report = this.getReport();
    console.log('\n📊 Performance Report:');
    console.log(`  Total Duration: ${report.totalDuration.toFixed(2)}ms`);
    console.log(`  Average Duration: ${report.averageDuration.toFixed(2)}ms`);
    console.log(`  Operations Completed: ${report.metrics.length}`);
    
    if (report.slowestOperations.length > 0) {
      console.log('\n  🐢 Slowest Operations:');
      report.slowestOperations.slice(0, 5).forEach((op, i) => {
        console.log(`    ${i + 1}. ${op.name}: ${op.duration?.toFixed(2)}ms`);
      });
    }
  }
}

/**
 * Memory usage monitor
 */
export class MemoryMonitor {
  private initialMemory: NodeJS.MemoryUsage;
  private checkInterval: NodeJS.Timeout | null = null;
  private memoryThreshold: number = 500 * 1024 * 1024; // 500MB

  constructor() {
    this.initialMemory = process.memoryUsage();
  }

  /**
   * Start monitoring memory usage
   */
  startMonitoring(intervalMs: number = 10000): void {
    this.checkInterval = setInterval(() => {
      this.checkMemory();
    }, intervalMs);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Check current memory usage
   */
  private checkMemory(): void {
    const usage = process.memoryUsage();
    const heapUsed = usage.heapUsed;
    
    if (heapUsed > this.memoryThreshold) {
      console.warn(`⚠️ High memory usage detected: ${(heapUsed / 1024 / 1024).toFixed(2)}MB`);
      this.suggestGarbageCollection();
    }
  }

  /**
   * Get memory usage report
   */
  getMemoryReport(): Record<string, string> {
    const usage = process.memoryUsage();
    return {
      rss: `${(usage.rss / 1024 / 1024).toFixed(2)}MB`,
      heapTotal: `${(usage.heapTotal / 1024 / 1024).toFixed(2)}MB`,
      heapUsed: `${(usage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      external: `${(usage.external / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  /**
   * Suggest garbage collection if available
   */
  private suggestGarbageCollection(): void {
    if (global.gc) {
      console.log('🧹 Running garbage collection...');
      global.gc();
    } else {
      console.log('💡 Tip: Run with --expose-gc flag to enable manual garbage collection');
    }
  }
}

/**
 * Request rate limiter
 */
export class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if request is allowed
   */
  async checkLimit(): Promise<boolean> {
    const now = Date.now();
    
    // Remove old requests outside the window
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }

  /**
   * Wait until request is allowed
   */
  async waitForSlot(): Promise<void> {
    while (!(await this.checkLimit())) {
      const oldestRequest = this.requests[0];
      const waitTime = this.windowMs - (Date.now() - oldestRequest) + 100;
      await new Promise(resolve => setTimeout(resolve, Math.max(waitTime, 100)));
    }
  }

  /**
   * Get current usage
   */
  getUsage(): { current: number; max: number; percentage: number } {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    return {
      current: this.requests.length,
      max: this.maxRequests,
      percentage: (this.requests.length / this.maxRequests) * 100,
    };
  }
}

/**
 * Cache manager for reducing redundant operations
 */
export class CacheManager<T> {
  private cache: Map<string, { data: T; timestamp: number }> = new Map();
  private readonly ttl: number;
  private readonly maxSize: number;

  constructor(ttlMs: number = 60000, maxSize: number = 1000) {
    this.ttl = ttlMs;
    this.maxSize = maxSize;
  }

  /**
   * Get cached value
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Set cached value
   */
  set(key: string, data: T): void {
    // Enforce max size
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitRate: 0, // Would need to track hits/misses for accurate rate
    };
  }
}

// Export singleton instances
export const performanceMonitor = new PerformanceMonitor();
export const memoryMonitor = new MemoryMonitor();

// Utility functions
export const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxAttempts) {
        console.log(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`);
        await delay(delayMs * attempt); // Exponential backoff
      }
    }
  }
  
  throw lastError;
};

export default performanceMonitor;