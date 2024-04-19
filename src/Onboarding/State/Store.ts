import { AppState, StateManager } from "../Types/State"
import { State } from "./State"

class Store implements StateManager<AppState>{
    private static instance: Store;
    private state: State<AppState>;

    constructor() {
        this.state = new State<AppState>({
            currentMap: "town",
            playerTags: [],
            rootUrl: "",
            checkpointIds: [],
            checklist: [],
        });
    }

    static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }

    // Get current state
    getState(): AppState {
        return this.state.getState();
    }

    // Set new state
    setState(newState: AppState): void {
        this.state.setState(newState);
    }

    // Subscribe to state changes
    subscribe(observer: (state: AppState) => void): void {
        this.state.addObserver(observer);
    }
}

// Create a singleton instance of the store
export const store = Store.getInstance();
