/**
 * Payment Persistence Utility
 * Manages automatic cleanup of payment-related localStorage data after 5 minutes
 */

const PERSISTENCE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Storage Keys used for payment persistence
 */
export const STORAGE_KEYS = {
    PAYMENT_RETRY_CONTEXT: 'paymentRetryContext',
    LAST_PAYMENT_CONTEXT: 'lastPaymentContext',
    FORM_DATA_PREFIX: 'formData_', // Dynamic key: formData_{eventId}
};

/**
 * Set payment persistence data with automatic expiration
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
export const setPaymentData = (key, data) => {
    const expirationTime = Date.now() + PERSISTENCE_DURATION;

    const storageData = {
        data,
        expiresAt: expirationTime,
    };

    localStorage.setItem(key, JSON.stringify(storageData));

    // Schedule cleanup
    scheduleCleanup(key, PERSISTENCE_DURATION);
};

/**
 * Get payment persistence data (returns null if expired)
 * @param {string} key - Storage key
 * @returns {any|null} - Stored data or null if expired/not found
 */
export const getPaymentData = (key) => {
    const item = localStorage.getItem(key);

    if (!item) return null;

    try {
        const { data, expiresAt } = JSON.parse(item);

        // Check if expired
        if (Date.now() > expiresAt) {
            localStorage.removeItem(key);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error parsing payment data:', error);
        return null;
    }
};

/**
 * Schedule automatic cleanup of a storage item
 * @param {string} key - Storage key
 * @param {number} delay - Delay in milliseconds
 */
const scheduleCleanup = (key, delay) => {
    setTimeout(() => {
        const item = localStorage.getItem(key);
        if (item) {
            try {
                const { expiresAt } = JSON.parse(item);
                if (Date.now() >= expiresAt) {
                    localStorage.removeItem(key);
                    console.log(`✓ Auto-cleared expired payment data: ${key}`);
                }
            } catch (error) {
                console.error('Error during scheduled cleanup:', error);
            }
        }
    }, delay);
};

/**
 * Clear all payment-related persistence data
 */
export const clearAllPaymentData = () => {
    // Clear known keys
    localStorage.removeItem(STORAGE_KEYS.PAYMENT_RETRY_CONTEXT);
    localStorage.removeItem(STORAGE_KEYS.LAST_PAYMENT_CONTEXT);

    // Clear all formData_* keys
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith(STORAGE_KEYS.FORM_DATA_PREFIX)) {
            localStorage.removeItem(key);
        }
    });

    console.log('✓ Cleared all payment persistence data');
};

/**
 * Initialize payment persistence cleanup on app load
 * Checks for expired items and schedules cleanup for active ones
 */
export const initPaymentPersistence = () => {
    // Check all localStorage items
    Object.keys(localStorage).forEach((key) => {
        // Only process payment-related keys
        if (
            key === STORAGE_KEYS.PAYMENT_RETRY_CONTEXT ||
            key === STORAGE_KEYS.LAST_PAYMENT_CONTEXT ||
            key.startsWith(STORAGE_KEYS.FORM_DATA_PREFIX)
        ) {
            const item = localStorage.getItem(key);
            if (item) {
                try {
                    const parsed = JSON.parse(item);

                    // Handle legacy format (no expiresAt field)
                    if (!parsed.expiresAt) {
                        // Add expiration to legacy data
                        const legacyData = parsed;
                        const expirationTime = Date.now() + PERSISTENCE_DURATION;
                        const newStorageData = {
                            data: legacyData,
                            expiresAt: expirationTime,
                        };
                        localStorage.setItem(key, JSON.stringify(newStorageData));
                        scheduleCleanup(key, PERSISTENCE_DURATION);
                    } else {
                        // Check if already expired
                        if (Date.now() > parsed.expiresAt) {
                            localStorage.removeItem(key);
                            console.log(`✓ Removed expired payment data: ${key}`);
                        } else {
                            // Schedule cleanup for remaining time
                            const remainingTime = parsed.expiresAt - Date.now();
                            scheduleCleanup(key, remainingTime);
                        }
                    }
                } catch (error) {
                    console.error(`Error processing payment data for ${key}:`, error);
                }
            }
        }
    });
};

/**
 * Get time remaining until expiration (in seconds)
 * @param {string} key - Storage key
 * @returns {number|null} - Seconds remaining or null if not found/expired
 */
export const getTimeRemaining = (key) => {
    const item = localStorage.getItem(key);

    if (!item) return null;

    try {
        const { expiresAt } = JSON.parse(item);
        const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));

        return remaining > 0 ? remaining : null;
    } catch (error) {
        return null;
    }
};
