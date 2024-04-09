/// <reference types="@workadventure/iframe-api-typings" />

import { CheckpointDescriptor, checkpoints, Checklist, saveChecklist, passCheckpoint } from './checkpoints';
import type { NPCs } from "./checkpoints";
import { placeTile, removeContentTile, removeDirectionTile } from "./tiles";
import { openDialogueBox, openWebsite, closeDialogueBox, closeWebsite } from "./ui";
import { map, playerTags } from "./index"
let nextJonasIsPlaced = false

export function processAreas(playerCheckpointIds: string[]) {
    let checklist: Checklist[] = [];

    console.log("Processing areas...")
    checkpoints.forEach(checkpoint => {
        // checkpoints of the player across maps
        if (filterCheckpointsByTag(checkpoint)) {
            const isPassed = playerCheckpointIds.includes(checkpoint.id);
            checklist.push({
                id: checkpoint.id,
                title: checkpoint.title,
                done: isPassed,
            });

            // checkpoints to place on the current map + additional filtering
            if (filterCheckpointsByMap(checkpoint) && filterCheckpointsNPCs(checkpoint, playerCheckpointIds)) {
                placeArea(checkpoint)
                placeTile(checkpoint)
            }  
        }  
    });

    saveChecklist(checklist)
}

function placeArea(checkpoint: CheckpointDescriptor) {
    console.log("placing area of checkpoint",checkpoint.id)
    const tileSize = 32
    const areaSize = 128
    const tileOriginX = checkpoint.coordinates.x * tileSize
    const tileOriginY = checkpoint.coordinates.y * tileSize
  
    const areaOriginX = tileOriginX - (areaSize - tileSize) / 2
    const areaOriginY = tileOriginY - (areaSize - tileSize) / 2

    WA.room.area.create({
        name: checkpoint.id,
        x: areaOriginX,
        y: areaOriginY,
        width: areaSize,
        height: areaSize,
    });

    WA.room.area.onEnter(checkpoint.id).subscribe(() => {
        console.log("onEnter checkpoint", checkpoint.id)
        if (checkpoint.type === "NPC" && checkpoint.message) {
            openDialogueBox(checkpoint.id)
        } else if (checkpoint.type === "content" && checkpoint.url) {
            openWebsite(checkpoint.url)
        } else if (checkpoint.type === "direction" && checkpoint.message) {
            openDialogueBox(checkpoint.id)
        }
    });

    WA.room.area.onLeave(checkpoint.id).subscribe(() => {
        console.log("onLeave checkpoint", checkpoint.id)
        if (checkpoint.type === "NPC") {
            closeDialogueBox()
        } else if (checkpoint.type === "content") {
            closeWebsite()
            removeContentTile(checkpoint.coordinates.x, checkpoint.coordinates.y)
            passCheckpoint(checkpoint.id)
        } else if (checkpoint.type === "direction") {
            WA.room.area.delete(checkpoint.id)
            removeDirectionTile(checkpoint.coordinates.x, checkpoint.coordinates.y)
            passCheckpoint(checkpoint.id)

            if (checkpoint.message) {
                closeDialogueBox()
            }
        }
    });
}

function filterCheckpointsByMap(checkpoint: CheckpointDescriptor): boolean {
    const checkopintId = checkpoint.id

    if (map !== checkpoint.map) {
        console.log(`Can't access checkpoint ${checkopintId} because it's not the right map`)
        return false
    }

    // Player can access view and access this checkpoint
    return true
}

function filterCheckpointsByTag(checkpoint: CheckpointDescriptor): boolean {
    const checkopintId = checkpoint.id

    if (checkpoint.tags && checkpoint.tags.every(tag => !playerTags.includes(tag))) {
        // At least one tag of the checkpoint matches any of the player's tags
        console.log(`Can't access checkpoint ${checkopintId} because player doesn't have the right tags`)
        return false
    }

    // Player can access view and access this checkpoint
    return true
}

function filterCheckpointsNPCs(checkpoint: CheckpointDescriptor, playerCheckpointIds: string[]): boolean {
    const checkopintId = checkpoint.id

    if (playerCheckpointIds.includes(checkpoint.id)) {
        // player already passed this checkpoint

        // Don't display passed Jonas NPCs
        if (checkpoint.type === "NPC" && checkpoint.npcName as NPCs === "Jonas") {
            console.log(`Can't access checkpoint ${checkopintId} because player has already met this Jonas`)
            return false
        }

        // Don't display passed directions
        if (checkpoint.type === "direction") {
            console.log(`Can't access checkpoint ${checkopintId} because player has already passed this direction`)
            return false
        }
    } else {
         // player did not pass this checkpoint
         // display only next Jonas, not others in the future
        if (checkpoint.type === "NPC" && checkpoint.npcName as NPCs === "Jonas") {
            if (nextJonasIsPlaced) {
                console.log(`Can't access checkpoint ${checkopintId} because next Jonas is already placed`)
                return false
            }

            nextJonasIsPlaced = true
        }
    }

    return true
}