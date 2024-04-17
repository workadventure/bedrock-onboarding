import type { Map } from "../Type/Maps";

export function getMapName(): Map {
    return WA.state.map as Map
}