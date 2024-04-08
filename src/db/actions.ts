import { openDB } from './index';

const withStore = (storeName: string, mode: IDBTransactionMode, callback: (store: IDBObjectStore) => void) => {
    openDB().then(db => {
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        callback(store);
        transaction.oncomplete = () => db.close();
    }).catch(error => console.error(`IndexedDB error: ${error}`));
};

export const getElement = <T>(store: string, key: string): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        withStore(store, 'readonly', (store) => {
            const request = key === 'all' ? store.getAll() : store.get(key);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
        });
    });
};

export const addElement = (store: string, payload: object): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        withStore(store, 'readwrite', (store) => {
            const request = store.add(payload);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    });
};

export const editElement = (store: string, payload: object): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        withStore(store, 'readwrite', (store) => {
            const request = store.put(payload);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    });
};

export const removeElement = (store: string, key: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        withStore(store, 'readwrite', (store) => {
            const request = key === 'all' ? store.clear() : store.delete(key);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve();
        });
    });
};
