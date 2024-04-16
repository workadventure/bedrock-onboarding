/// <reference types="@workadventure/iframe-api-typings" />

import { type Tag, initCheckpoints } from "./checkpoints";
import { processAreas } from "./areas";
import { MapName } from "../main";

export async function initOnboarding(playerCheckpointIds: string[]) {
    const playerCheckpointIdsInit = await initCheckpoints(playerCheckpointIds)
    processAreas(playerCheckpointIdsInit)
}

export function getPlayerTags(): Tag[] {
    return WA.player.tags as Tag[]
}

export function getMapName(): MapName {
    return WA.state.map as MapName
}