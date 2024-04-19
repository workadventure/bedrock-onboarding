/// <reference types="@workadventure/iframe-api-typings" />

import { StateManager } from "../../Types/State";
import { store } from "../Store";
import { Checklist } from "../../Types/Checkpoints";

class ChecklistStore implements StateManager<Checklist[]> {
    private static instance: ChecklistStore;

    // Private constructor to prevent external instantiation
    private constructor() { }

    static getInstance(): ChecklistStore {
        if (!ChecklistStore.instance) {
            ChecklistStore.instance = new ChecklistStore();
        }
        return ChecklistStore.instance;
    }

    getState(): Checklist[] {
        return store.getState().checklist;
    }

    setState(checklist: Checklist[]): void {
        const currentState = store.getState();
        const newState = { ...currentState, checklist };
        store.setState(newState);
    }

    subscribe(observer: (checklist: Checklist[]) => void): void {
        store.subscribe((state) => {
            observer(state.checklist);
        });
    }

    /*
    ********************************************* Async getters/setters *********************************************
    */
   
    async getAsyncState(): Promise<Checklist[]> {
        // If the value has already been set, return it instead of calling the API
        return this.getState() ? this.getState() : await WA.player.state.checklist as Checklist[];
    }

    async setAsyncState(checklist: Checklist[]): Promise<void> {
        this.setState(checklist);

        await WA.player.state.saveVariable("checklist", checklist, {
            public: false,
            persist: true,
            ttl: 48 * 3600,
            scope: "world",
        });
    }

    /*
    ********************************************* Helpers functions *********************************************
    */

    async markCheckpointAsDone(checkpointId: string) {
        let checklist = await this.getAsyncState()

        // mark the checkpoint as done
        const checkpointIdx = checklist.findIndex(checkpoint => checkpoint.id === checkpointId)
        checklist[checkpointIdx].done = checkpointIdx !== -1;

        this.setAsyncState(checklist)
    }
}


// Export the singleton instance
export const checklistStore = ChecklistStore.getInstance();
