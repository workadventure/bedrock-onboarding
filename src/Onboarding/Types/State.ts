import { Map } from "./Maps";
import { Tag } from "./Tags";
import { Checklist } from "./Checkpoints";

export interface StateManager<T> {
    getState(): T;
    setState(newState: T): void;
    subscribe(observer: (state: T) => void): void;
}

export interface AppState {
    currentMap: Map,
    playerTags: Tag[],
    rootUrl: string,
    checkpointIds: string[],
    checklist: Checklist[],
}