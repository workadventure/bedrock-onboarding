/// <reference types="@workadventure/iframe-api-typings" />

import { Tag, initCheckpoints } from "./checkpoints";
import { processAreas } from "./areas";
import { MapName } from "../main";

export async function initOnboarding() {
    const playerCheckpointIds = await initCheckpoints()
    processAreas(playerCheckpointIds)
}

export function getPlayerTags(): Tag[] {
    return WA.player.tags as Tag[]
}

export function getMapName(): MapName {
    return WA.state.map as MapName
}