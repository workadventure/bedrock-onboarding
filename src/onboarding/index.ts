/// <reference types="@workadventure/iframe-api-typings" />

import type { Tag } from "./checkpoints";
import { isCheckpointPassed, getNextCheckpoint } from "./checkpoints";
import { processAreas } from "./areas";
import { openCheckpointBanner, closeBanner } from "./ui";

export let map: string;
export let playerTags: Tag[];
export let playerCheckpointIds: string[];

export function initOnboarding(mapParam: string, playerTagsParam: Tag[], playerCheckpointIdsParam: string[]) {
    map = mapParam
    playerTags = playerTagsParam
    playerCheckpointIds = playerCheckpointIdsParam

    if (playerCheckpointIds) {
        console.log("Existing player arrived. Checkpoints: ", playerCheckpointIds)
        openCheckpointBanner(getNextCheckpoint(playerCheckpointIds))
    } else {
        console.log("New player arrived.");
        WA.player.state.checkpoints = ["0"];
    }

    processAreas()
}

export function passCheckpoint(checkpointId: string) {
    closeBanner()
    let playerCheckpoints = WA.player.state.checkpoints as string[]
    // Affect checkpoint only if it has not been passed already
    if (isCheckpointPassed(playerCheckpoints, checkpointId)) {
        console.log("(State: unchanged) Old checkpoint passed", checkpointId)
    } else {
        console.log("(State: update) New checkpoint passed", checkpointId);
        playerCheckpoints.push(checkpointId)
        WA.player.state.checkpoints = playerCheckpoints
        openCheckpointBanner(getNextCheckpoint(playerCheckpoints))
         // TODO: actions based on checkpoint, like unlocking doors
    }
}
