/**
 * Storage Service
 * 
 * Provides a unified interface for browser storage operations.
 * Implements localStorage with fallback mechanisms and type safety.
 * Includes versioning and migration support for schema changes.
 * 
 * Features:
 * - Type-safe storage operations
 * - Automatic JSON serialization/deserialization
 * - Storage quota management
 * - Error handling and fallback
 * - Storage events for cross-tab synchronization
 * - Data versioning and migration
 */

export class StorageService {
    #prefix = 'browser-agents';
    #version = '1.0.0';

    constructor(prefix = 'browser-agents') {
        this.#prefix = prefix;
        this.#checkStorageAvailability();
        this.#initializeVersioning();
        this.#setupStorageEventListener();
    }

    /**
     * Check if localStorage is available
     * @private
     */
    #checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage is not available. Using in-memory fallback.');
            this.#initializeMemoryFallback();
            return false;
        }
    }

    /**
     * Initialize in-memory storage fallback
     * @private
     */
    #initializeMemoryFallback() {
        this.#memoryStorage = new Map();
        
        // Override storage methods to use memory storage
        this.#isUsingMemoryFallback = true;
    }

    /**
     * Initialize version tracking for migrations
     * @private
     */
    #initializeVersioning() {
        const storedVersion = this.get('__version__');
        
        if (!storedVersion) {
            this.set('__version__', this.#version);
        } else if (storedVersion !== this.#version) {
            this.#migrate(storedVersion, this.#version);
        }
    }

    /**
     * Setup storage event listener for cross-tab sync
     * @private
     */
    #setupStorageEventListener() {
        if (typeof window !== 'undefined') {
            window.addEventListener('storage', (event) => {
                if (event.key?.startsWith(this.#prefix)) {
                    const key = this.#removePrefix(event.key);
                    this.#dispatchStorageChange(key, event.newValue, event.oldValue);
                }
            });
        }
    }

    /**
     * Migrate data between versions
     * @private
     */
    #migrate(fromVersion, toVersion) {
        console.log(`Migrating storage from ${fromVersion} to ${toVersion}`);
        
        // Add migration logic here when schema changes
        // Example:
        // if (fromVersion === '1.0.0' && toVersion === '2.0.0') {
        //     // Perform migration
        // }
        
        this.set('__version__', toVersion);
    }

    /**
     * Get prefixed key
     * @private
     */
    #getPrefixedKey(key) {
        return `${this.#prefix}:${key}`;
    }

    /**
     * Remove prefix from key
     * @private
     */
    #removePrefix(prefixedKey) {
        return prefixedKey.replace(`${this.#prefix}:`, '');
    }

    /**
     * Get value from storage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} Stored value or default
     */
    get(key, defaultValue = null) {
        try {
            const prefixedKey = this.#getPrefixedKey(key);
            
            if (this.#isUsingMemoryFallback) {
                return this.#memoryStorage.get(prefixedKey) ?? defaultValue;
            }

            const item = localStorage.getItem(prefixedKey);
            
            if (item === null) {
                return defaultValue;
            }

            // Try to parse as JSON, fallback to raw string
            try {
                return JSON.parse(item);
            } catch {
                return item;
            }
        } catch (error) {
            console.error(`Error getting ${key} from storage:`, error);
            return defaultValue;
        }
    }

    /**
     * Set value in storage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} Success status
     */
    set(key, value) {
        try {
            const prefixedKey = this.#getPrefixedKey(key);
            const serialized = typeof value === 'string' ? value : JSON.stringify(value);

            if (this.#isUsingMemoryFallback) {
                this.#memoryStorage.set(prefixedKey, value);
                return true;
            }

            localStorage.setItem(prefixedKey, serialized);
            return true;
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('Storage quota exceeded');
                this.#handleQuotaExceeded();
            } else {
                console.error(`Error setting ${key} in storage:`, error);
            }
            return false;
        }
    }

    /**
     * Remove value from storage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    remove(key) {
        try {
            const prefixedKey = this.#getPrefixedKey(key);

            if (this.#isUsingMemoryFallback) {
                return this.#memoryStorage.delete(prefixedKey);
            }

            localStorage.removeItem(prefixedKey);
            return true;
        } catch (error) {
            console.error(`Error removing ${key} from storage:`, error);
            return false;
        }
    }

    /**
     * Check if key exists in storage
     * @param {string} key - Storage key
     * @returns {boolean} Existence status
     */
    has(key) {
        const prefixedKey = this.#getPrefixedKey(key);

        if (this.#isUsingMemoryFallback) {
            return this.#memoryStorage.has(prefixedKey);
        }

        return localStorage.getItem(prefixedKey) !== null;
    }

    /**
     * Clear all storage for this prefix
     */
    clear() {
        try {
            if (this.#isUsingMemoryFallback) {
                this.#memoryStorage.clear();
                return;
            }

            // Get all keys with our prefix
            const keys = Object.keys(localStorage);
            const prefixedKeys = keys.filter(key => key.startsWith(this.#prefix));
            
            prefixedKeys.forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }

    /**
     * Get all keys for this prefix
     * @returns {Array<string>} Array of keys (without prefix)
     */
    keys() {
        if (this.#isUsingMemoryFallback) {
            return Array.from(this.#memoryStorage.keys())
                .map(key => this.#removePrefix(key));
        }

        const keys = Object.keys(localStorage);
        return keys
            .filter(key => key.startsWith(this.#prefix))
            .map(key => this.#removePrefix(key));
    }

    /**
     * Get storage size estimate in bytes
     * @returns {number} Estimated size in bytes
     */
    getSize() {
        if (this.#isUsingMemoryFallback) {
            let size = 0;
            this.#memoryStorage.forEach((value, key) => {
                size += key.length + JSON.stringify(value).length;
            });
            return size;
        }

        let size = 0;
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.#prefix)) {
                size += key.length + (localStorage.getItem(key)?.length || 0);
            }
        });
        return size;
    }

    /**
     * Get remaining storage quota estimate
     * @returns {number|null} Remaining bytes or null if unavailable
     */
    async getRemainingQuota() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate();
                return estimate.quota - estimate.usage;
            } catch (error) {
                console.error('Error getting storage quota:', error);
            }
        }
        return null;
    }

    /**
     * Handle storage quota exceeded
     * @private
     */
    #handleQuotaExceeded() {
        console.warn('Storage quota exceeded. Consider clearing old data.');
        
        // Dispatch event for UI to handle
        this.#dispatchStorageChange('quota-exceeded', null, null);
    }

    /**
     * Dispatch storage change event
     * @private
     */
    #dispatchStorageChange(key, newValue, oldValue) {
        if (typeof window !== 'undefined') {
            const event = new CustomEvent('storage-changed', {
                detail: { key, newValue, oldValue }
            });
            window.dispatchEvent(event);
        }
    }

    /**
     * Export all data for backup
     * @returns {Object} All stored data
     */
    exportAll() {
        const data = {};
        this.keys().forEach(key => {
            data[key] = this.get(key);
        });
        return {
            data,
            version: this.#version,
            exportedAt: new Date().toISOString()
        };
    }

    /**
     * Import data from backup
     * @param {Object} backup - Backup data object
     */
    importAll(backup) {
        if (!backup.data) {
            throw new Error('Invalid backup format');
        }

        Object.entries(backup.data).forEach(([key, value]) => {
            this.set(key, value);
        });
    }

    /**
     * Create namespaced storage instance
     * @param {string} namespace - Namespace to use
     * @returns {StorageService} New storage instance
     */
    namespace(namespace) {
        return new StorageService(`${this.#prefix}:${namespace}`);
    }
}
