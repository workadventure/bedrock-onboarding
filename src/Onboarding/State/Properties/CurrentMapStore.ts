/// <reference types="@workadventure/iframe-api-typings" />

import { StateManager } from "../../Types/State";
import { store } from "../Store";
import type { Map } from "../../Types/Maps";

class CurrentMapStore implements StateManager<Map> {
    private static instance: CurrentMapStore;
    
    // Private constructor to prevent external instantiation
    private constructor() {}

    static getInstance(): CurrentMapStore {
        if (!CurrentMapStore.instance) {
            CurrentMapStore.instance = new CurrentMapStore();
        }
        return CurrentMapStore.instance;
    }

    getState(): Map {
        return store.getState().currentMap;
    }

    setState(map: Map): void {
        const currentState = store.getState();
        const newState = { ...currentState, currentMap: map };
        store.setState(newState);
    }

    subscribe(observer: (map: Map) => void): void {
        store.subscribe((state) => {
            observer(state.currentMap);
        });
    }

    /*
    ********************************************* init *********************************************
    */

    initState(): void {
        this.setState(WA.state.map as Map);
    }

    /*
    ********************************************* Helpers functions *********************************************
    */

    isTown(): boolean {
        const currentMap = this.getState();
        return currentMap === "town";
    }

    isWorld(): boolean {
        const currentMap = this.getState();
        return currentMap === "world";
    }
}

// Export the singleton instance
export const currentMapStore = CurrentMapStore.getInstance();