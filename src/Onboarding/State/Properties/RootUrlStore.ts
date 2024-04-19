/// <reference types="@workadventure/iframe-api-typings" />

import { StateManager } from "../../Types/State";
import { store } from "../Store";

class RootUrlStore implements StateManager<string> {
    private static instance: RootUrlStore;
    
    // Private constructor to prevent external instantiation
    private constructor() {}

    static getInstance(): RootUrlStore {
        if (!RootUrlStore.instance) {
            RootUrlStore.instance = new RootUrlStore();
        }
        return RootUrlStore.instance;
    }

    getState(): string {
        return store.getState().rootUrl;
    }

    setState(rootUrl: string): void {
        const currentState = store.getState();
        const newState = { ...currentState, rootUrl };
        store.setState(newState);
    }

    subscribe(observer: (rootUrl: string) => void): void {
        store.subscribe((state) => {
            observer(state.rootUrl);
        });
    }


    /*
    ********************************************* init *********************************************
    */

    initState(): void {
        const mapUrl = WA.room.mapURL;
        const rootUrl = mapUrl.substring(0, mapUrl.lastIndexOf("/"));
        this.setState(rootUrl);
    }
}

// Export the singleton instance
export const rootUrlStore = RootUrlStore.getInstance();
