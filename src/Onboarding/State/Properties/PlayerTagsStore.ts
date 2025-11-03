/// <reference types="@workadventure/iframe-api-typings" />

import { StateManager } from "../../Types/State";
import { store } from "../Store";
import type { Tag } from "../../Types/Tags";
import { employees, everyone, everyoneButGuests, newbies } from "../../Constants/Tags";

class PlayerTagsStore implements StateManager<Tag[]>
{
    private static instance: PlayerTagsStore;

    // Private constructor to prevent external instantiation
    private constructor()
    {
        // This constructor is intentionally left empty
    }

    static getInstance(): PlayerTagsStore
    {
        if (!PlayerTagsStore.instance)
        {
            PlayerTagsStore.instance = new PlayerTagsStore();
        }
        return PlayerTagsStore.instance;
    }

    getState(): Tag[]
    {
        return store.getState().playerTags;
    }

    setState(tags: Tag[]): void
    {
        const currentState = store.getState();
        const newState = { ...currentState, playerTags: tags };
        store.setState(newState);
    }

    subscribe(observer: (tags: Tag[]) => void): void
    {
        store.subscribe((state) =>
        {
            observer(state.playerTags);
        });
    }

    /*
    ********************************************* init *********************************************
    */

    initState(): void
    {
        console.log("Player tags", WA.player.tags);
        this.setState(WA.player.tags as Tag[]);
    }

    /*
    ********************************************* Helpers functions *********************************************
    */

    hasMandatoryTags(): boolean
    {
        const playerTags = this.getState();
        return playerTags.some(tag => everyone.includes(tag));
    }

    hasMandatoryTagsIn(checkpointTags: Tag[]): boolean
    {
        const playerTags = this.getState();
        return playerTags.some(tag => checkpointTags.includes(tag));
    }

    isAdmin(): boolean
    {
        const playerTags = this.getState();
        return playerTags.some(tag => tag === "admin");
    }

    isEmployee(): boolean
    {
        const playerTags = this.getState();
        return playerTags.some(tag => employees.includes(tag));
    }

    isHr(): boolean
    {
        const playerTags = this.getState();
        return playerTags.some(tag => ["admin", "hr"].includes(tag))
    }

    isNewbie(): boolean
    {
        const playerTags = this.getState();
        return playerTags.some(tag => newbies.includes(tag));
    }

    hasFrProfile(): boolean
    {
        const playerTags = this.getState();
        return playerTags.some(tag => tag === "fr");
    }

    hasDeProfile(): boolean
    {
        const playerTags = this.getState();
        return playerTags.some(tag => tag === "de");
    }

    hasPtProfile(): boolean
    {
        const playerTags = this.getState();
        return playerTags.some(tag => tag === "pt");
    }

    hasAltProfile(): boolean
    {
        const playerTags = this.getState();
        return playerTags.some(tag => tag === "alt");
    }

    hasExtProfile(): boolean
    {
        const playerTags = this.getState();
        return playerTags.some(tag => tag === "ext");
    }

    isGuest(): boolean
    {
        const playerTags = this.getState();
        return playerTags.some(tag => tag === "guest");
    }

    isOtherThanGuest(): boolean
    {
        const playerTags = this.getState();
        return playerTags.some(tag => everyoneButGuests.includes(tag));
    }
}

// Export the singleton instance
export const playerTagsStore = PlayerTagsStore.getInstance();
