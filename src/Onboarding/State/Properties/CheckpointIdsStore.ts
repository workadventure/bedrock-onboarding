/// <reference types="@workadventure/iframe-api-typings" />

import { StateManager } from "../../Types/State";
import { store } from "../Store";
import { checkpoints } from "../../Constants/Checkpoints";
import { Checklist } from "../../Types/Checkpoints";

class CheckpointIdsStore implements StateManager<string[]> {
    private static instance: CheckpointIdsStore;

    // Private constructor to prevent external instantiation
    private constructor() {
        // This constructor is intentionally left empty
    }

    static getInstance(): CheckpointIdsStore {
        if (!CheckpointIdsStore.instance) {
            CheckpointIdsStore.instance = new CheckpointIdsStore();
        }
        return CheckpointIdsStore.instance;
    }

    getState(): string[] {
        return store.getState().checkpointIds;
    }

    setState(checkpointIds: string[]): void {
        const currentState = store.getState();
        const newState = { ...currentState, checkpointIds };
        store.setState(newState);
    }

    subscribe(observer: (checkpointIds: string[]) => void): void {
        store.subscribe((state) => {
            observer(state.checkpointIds);
        });
    }

    /*
    ********************************************* Async operations *********************************************
    */

    async initAsyncState(): Promise<void> {
        let checkpointIds = await WA.player.state.checkpointIds as string[];
        
        // When a player arrives in the game, we have two option:
            // 1. It's a new player and he has no data yet, no checkpoints. So we give him the checkpoint "0" in order to identify (if he reloads the page) that that player has not began the game but he connected at least one time already.
            // 2. It's an existing player (rather because he has just "0" as the list of checkpoints, or more checkpoints)
        if (!checkpointIds || checkpointIds.length <= 1) {
            console.log("New player")
            checkpointIds = ["0"];
        }

        console.log("initAsyncState checkpointIds",checkpointIds)
        await this.setAsyncState(checkpointIds);
    }
   
    async getAsyncState(): Promise<string[]> {
        // If the value has already been set, return it instead of calling the API
        return this.getState() ? this.getState() : await WA.player.state.checkpointIds as string[];
    }

    async setAsyncState(checkpointIds: string[]): Promise<void> {
        this.setState(checkpointIds);
        await WA.player.state.saveVariable("checkpointIds", checkpointIds, {
            public: false,
            persist: true,
            scope: "world",
        });
    }

    /*
    ********************************************* Helpers functions *********************************************
    */

    async addCheckpointId(checkpointId: string): Promise<void> {
        const checkpointIds = this.getState();
        checkpointIds.push(checkpointId);
        await this.setAsyncState(checkpointIds);
    }

    getNextCheckpointId(checklist: Checklist[]): string {
        // Find the first checklist item that is not done
        const nextCheckpoint = checklist.find(checkpoint => !checkpoint.done);

        // If a next checkpoint is found, return its ID; otherwise, return -1
        return nextCheckpoint ? nextCheckpoint.id : "-1";
    }

    getJonasCheckpointIds(): string[] {
        return checkpoints
            .filter(checkpoint => checkpoint?.npcName === "Jonas")
            .map(checkpoint => checkpoint.id);
    }

    getCheckpointXP(checkpointId: string): number {
        const checkpoint = checkpoints.find(cp => cp.id === checkpointId);
        
        if (!checkpoint) return 0; 
        return checkpoint.xp;
    }

    getNextJonasCheckpointId(): string {
        console.log("ALL JONAS checkopints",this.getJonasCheckpointIds())
        // Convert string elements to numbers in order to do some Math
        const numericPlayerCheckpointIds: number[] = this.getState().map(Number);
        const numericJonasCheckpoints: number[] = this.getJonasCheckpointIds().map(Number);

        // Find the highest checkpoint ID the player has reached
        const maxPlayerCheckpointId = Math.max(...numericPlayerCheckpointIds);

        // Find the next Jonas checkpoint ID
        const nextJonasCheckpointId = numericJonasCheckpoints.find(id => id > maxPlayerCheckpointId);

        console.log("next jonas",nextJonasCheckpointId !== undefined ? nextJonasCheckpointId.toString() : "-1")
        // If there is a next Jonas checkpoint, return its ID as a string; otherwise, return "-1"
        return nextJonasCheckpointId !== undefined ? nextJonasCheckpointId.toString() : "-1";
    }

    isCheckpointPassed(checkpointId: string): boolean {
        return this.getState().includes(checkpointId);
    }

    hasPlayerMetJonas(): boolean {
        return this.getState().includes("2");
    }

    isCheckpointAfterFirstJonas(checkpointId: string): boolean {
        // Don't display rest of checkpoints if player did not meet Jonas
        const checkpointIdNumber = parseInt(checkpointId, 10);
        return checkpointIdNumber > 2;
    }

    canEnterCaveWorld(): boolean {
        return this.getState().includes("4");
    }

    hasPlayerTalkedWithJonasInTheCave(): boolean {
        return this.getState().includes("6");
    }

    isCheckpointJonasPhone(checkpointId: string): boolean {
        return checkpointId === "7";
    }

    canLeaveCaveWorld(): boolean {
        return this.getState().includes("7");
    }

    canAccessAchievements(): boolean {
        return this.getState().includes("9");
    }

    canAccessValues(): boolean {
        return this.getState().includes("10");
    }

    canAccessLegal(): boolean {
        return this.getState().includes("11");
    }

    canAccessBridge(): boolean {
        return this.getState().includes("12");
    }

    canAccessFrance(): boolean {
        return this.getState().includes("13");
    }

    canAccessHungary(): boolean {
        return ["14", "15"].every(id => this.getState().includes(id));
    }

    canAccessBelgium(): boolean {
        return ["16", "17"].every(id => this.getState().includes(id));
    }

    canAccessNetherlands(): boolean {
        return ["18", "19"].every(id => this.getState().includes(id));
    }

    canEnterAirport(): boolean {
        return ["20", "21"].every(id => this.getState().includes(id));
    }

    canEnterAirportGates(): boolean {
        return this.getState().includes("22");
    }

    canEnterBRTower(): boolean {
        return this.getState().includes("24");
    }

    isCheckpointInBrTower(checkpointId: string): boolean {
        const checkpointIdNumber = parseInt(checkpointId, 10);
        return 25 <= checkpointIdNumber && checkpointIdNumber <= 29;
    }

    canEnterBRTowerFloor3(): boolean {
        return this.getState().includes("25");
    }

    canEnterBRTowerFloor2(): boolean {
        return this.getState().includes("26");
    }

    canEnterBRTowerFloor1(): boolean {
        return this.getState().includes("27");
    }

    canEnterBRTowerFloor0(): boolean {
        return this.getState().includes("28");
    }

    canLeaveBRTower(): boolean {
        return this.getState().includes("29");
    }

    isWorldMapDone(): boolean {
        return this.getState().includes("32");
    }

    isBackstageDone(): boolean {
        return ["33", "34"].every(id => this.getState().includes(id));
    }

    isContentFRChecked(): boolean {
        return ["39", "40", "41"].every(id => this.getState().includes(id));
    }

    isContentPTChecked(): boolean {
        return ["42", "43", "44"].every(id => this.getState().includes(id));
    }

    isContentALTChecked(): boolean {
        return ["45", "46", "47"].every(id => this.getState().includes(id));
    }

    isContentEXTChecked(): boolean {
        return ["48", "49"].every(id => this.getState().includes(id));
    }

    isLockedCheckpointAfterOnboarding(checkpointId: string): boolean {
        // Don't display some checkpoints after onboarding if it's not done yet
        const checkpointIdNumber = parseInt(checkpointId, 10);
        return 33 <= checkpointIdNumber && checkpointIdNumber <= 39;
    }
}

// Export the singleton instance
export const checkpointIdsStore = CheckpointIdsStore.getInstance();
