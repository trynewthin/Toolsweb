const PREFIX = "toolshub_";

export const StorageService = {
    get<T>(key: string, defaultValue: T): T {
        try {
            const item = localStorage.getItem(PREFIX + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error("Storage error:", e);
            return defaultValue;
        }
    },

    set<T>(key: string, value: T): void {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(value));
        } catch (e) {
            console.error("Storage set error:", e);
        }
    },
};
