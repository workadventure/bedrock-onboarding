import { AppState } from "../Types/State"

export class State<T extends AppState> {
    private state: T;
    private observers: ((state: T) => void)[] = [];

    constructor(initialState: T) {
        this.state = initialState;
    }

    // Get current state
    getState(): T {
        return this.state;
    }

    // Set new state and notify observers
    setState(newState: T): void {
        this.state = newState;
        this.notifyObservers();
    }

    // Register observer
    addObserver(observer: (state: T) => void): void {
        this.observers.push(observer);
    }

    // Notify all observers
    private notifyObservers(): void {
        this.observers.forEach(observer => observer(this.state));
    }
}