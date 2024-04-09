/// <reference types="@workadventure/iframe-api-typings" />

import { initCheckpoints, type Tag } from "./checkpoints";
import { processAreas } from "./areas";

export let map: string;
export let playerTags: Tag[];

export async function initOnboarding(mapParam: string, playerTagsParam: Tag[]) {
    map = mapParam
    playerTags = playerTagsParam

    const playerCheckpointIds = await initCheckpoints()
    processAreas(playerCheckpointIds)
}