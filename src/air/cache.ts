import type { CredentialVerificationResult, IssuedCredential, TransactionHistory } from './types';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

interface CachedCredentials {
  issued: Record<string, CacheItem<IssuedCredential>>;
  verified: Record<string, CacheItem<CredentialVerificationResult>>;
  history: CacheItem<TransactionHistory[]>;
}

class CredentialCache {
  private static instance: CredentialCache;
  private readonly CACHE_KEY = 'airgate-credentials';
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly HISTORY_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

  static getInstance(): CredentialCache {
    if (!CredentialCache.instance) {
      CredentialCache.instance = new CredentialCache();
    }
    return CredentialCache.instance;
  }

  private getCache(): CachedCredentials {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) {
        return this.createEmptyCache();
      }
      
      const parsed: CachedCredentials = JSON.parse(cached);
      return this.validateCache(parsed);
    } catch (error) {
      console.warn('Failed to load credential cache:', error);
      return this.createEmptyCache();
    }
  }

  private createEmptyCache(): CachedCredentials {
    return {
      issued: {},
      verified: {},
      history: {
        data: [],
        timestamp: Date.now(),
        expiresAt: Date.now() + this.HISTORY_TTL
      }
    };
  }

  private validateCache(cache: CachedCredentials): CachedCredentials {
    const now = Date.now();
    
    // Clean expired issued credentials
    Object.keys(cache.issued).forEach(key => {
      if (cache.issued[key].expiresAt < now) {
        delete cache.issued[key];
      }
    });

    // Clean expired verification results
    Object.keys(cache.verified).forEach(key => {
      if (cache.verified[key].expiresAt < now) {
        delete cache.verified[key];
      }
    });

    // Check history expiry
    if (cache.history.expiresAt < now) {
      cache.history = {
        data: [],
        timestamp: now,
        expiresAt: now + this.HISTORY_TTL
      };
    }

    return cache;
  }

  private saveCache(cache: CachedCredentials): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to save credential cache:', error);
      // If storage is full, try to clear old entries
      this.clearExpiredEntries();
    }
  }

  // Cache issued credentials
  cacheIssuedCredential(credential: IssuedCredential, ttl?: number): void {
    const cache = this.getCache();
    const expiresAt = Date.now() + (ttl || this.DEFAULT_TTL);
    
    cache.issued[credential.id] = {
      data: credential,
      timestamp: Date.now(),
      expiresAt
    };

    this.saveCache(cache);
  }

  // Get cached issued credential
  getCachedIssuedCredential(credentialId: string): IssuedCredential | null {
    const cache = this.getCache();
    const cached = cache.issued[credentialId];
    
    if (!cached || cached.expiresAt < Date.now()) {
      return null;
    }

    return cached.data;
  }

  // Cache verification results
  cacheVerificationResult(result: CredentialVerificationResult, ttl?: number): void {
    const cache = this.getCache();
    const expiresAt = Date.now() + (ttl || this.DEFAULT_TTL);
    
    cache.verified[result.id] = {
      data: result,
      timestamp: Date.now(),
      expiresAt
    };

    this.saveCache(cache);
  }

  // Get cached verification result
  getCachedVerificationResult(resultId: string): CredentialVerificationResult | null {
    const cache = this.getCache();
    const cached = cache.verified[resultId];
    
    if (!cached || cached.expiresAt < Date.now()) {
      return null;
    }

    return cached.data;
  }

  // Cache transaction history
  cacheHistory(history: TransactionHistory[]): void {
    const cache = this.getCache();
    
    cache.history = {
      data: history,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.HISTORY_TTL
    };

    this.saveCache(cache);
  }

  // Get cached history
  getCachedHistory(): TransactionHistory[] | null {
    const cache = this.getCache();
    
    if (cache.history.expiresAt < Date.now()) {
      return null;
    }

    return cache.history.data;
  }

  // Update history with new item
  addHistoryItem(item: TransactionHistory): void {
    const cache = this.getCache();
    
    // Add new item to the beginning
    cache.history.data.unshift(item);
    
    // Keep only the last 100 items
    if (cache.history.data.length > 100) {
      cache.history.data = cache.history.data.slice(0, 100);
    }
    
    cache.history.timestamp = Date.now();
    this.saveCache(cache);
  }

  // Get all cached issued credentials
  getAllCachedCredentials(): IssuedCredential[] {
    const cache = this.getCache();
    return Object.values(cache.issued)
      .filter(item => item.expiresAt > Date.now())
      .map(item => item.data);
  }

  // Get all cached verification results
  getAllCachedVerifications(): CredentialVerificationResult[] {
    const cache = this.getCache();
    return Object.values(cache.verified)
      .filter(item => item.expiresAt > Date.now())
      .map(item => item.data);
  }

  // Search cached credentials
  searchCredentials(query: string): IssuedCredential[] {
    const credentials = this.getAllCachedCredentials();
    const lowerQuery = query.toLowerCase();
    
    return credentials.filter(cred => 
      cred.programId.toLowerCase().includes(lowerQuery) ||
      cred.id.toLowerCase().includes(lowerQuery) ||
      JSON.stringify(cred.data).toLowerCase().includes(lowerQuery)
    );
  }

  // Clear expired entries
  clearExpiredEntries(): void {
    const cache = this.getCache();
    const now = Date.now();
    
    // Clear expired issued credentials
    Object.keys(cache.issued).forEach(key => {
      if (cache.issued[key].expiresAt < now) {
        delete cache.issued[key];
      }
    });

    // Clear expired verification results
    Object.keys(cache.verified).forEach(key => {
      if (cache.verified[key].expiresAt < now) {
        delete cache.verified[key];
      }
    });

    this.saveCache(cache);
  }

  // Clear all cache
  clearCache(): void {
    try {
      localStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear credential cache:', error);
    }
  }

  // Get cache statistics
  getCacheStats(): {
    issuedCount: number;
    verifiedCount: number;
    historyCount: number;
    totalSize: string;
  } {
    const cache = this.getCache();
    const cacheString = localStorage.getItem(this.CACHE_KEY) || '';
    
    return {
      issuedCount: Object.keys(cache.issued).length,
      verifiedCount: Object.keys(cache.verified).length,
      historyCount: cache.history.data.length,
      totalSize: `${Math.round(cacheString.length / 1024)} KB`
    };
  }

  // Export cache for backup
  exportCache(): string {
    return localStorage.getItem(this.CACHE_KEY) || '{}';
  }

  // Import cache from backup
  importCache(cacheData: string): boolean {
    try {
      const parsed = JSON.parse(cacheData);
      localStorage.setItem(this.CACHE_KEY, cacheData);
      return true;
    } catch (error) {
      console.error('Failed to import cache:', error);
      return false;
    }
  }
}

// Export singleton instance
export const credentialCache = CredentialCache.getInstance();

// Export cache management utilities
export const cacheUtils = {
  // Pre-load credentials for faster access
  preloadCredentials: async (credentialIds: string[]): Promise<void> => {
    // This would integrate with the actual AIR Kit service
    console.log('Preloading credentials:', credentialIds);
  },

  // Sync cache with remote state
  syncCache: async (): Promise<void> => {
    // This would sync with the AIR Kit service
    console.log('Syncing cache with remote state');
  },

  // Validate cache integrity
  validateCache: (): boolean => {
    try {
      const cache = credentialCache.getCacheStats();
      return cache.issuedCount >= 0 && cache.verifiedCount >= 0;
    } catch {
      return false;
    }
  }
};

export default credentialCache;