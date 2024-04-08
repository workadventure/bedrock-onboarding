export const openDB = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('data', 1);
        request.onerror = () => reject(`IndexedDB error: ${request.error}`);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (_event) => {
            const db = request.result;
            if (!db.objectStoreNames.contains('todos')) {
                db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
            }
        };
    });
};
