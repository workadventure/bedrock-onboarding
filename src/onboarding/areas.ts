/// <reference types="@workadventure/iframe-api-typings" />

import { CheckpointDescriptor, checkpoints, Checklist, saveChecklist, passCheckpoint, isOnboardingDone, isCheckpointAfterOnboarding, isCheckpointAfterFirstJonas, hasPlayerMetJonas } from './checkpoints';
import type { NPCs, Tag } from "./checkpoints";
import { placeTile, removeContentTile, removeDirectionTile } from "./tiles";
import { openDialogueBox, openWebsite, closeDialogueBox, closeWebsite } from "./ui";
import { type MapName } from "../main"
import { getPlayerTags, getMapName } from "./index"

let isNextJonasPlaced = false

export function processAreas(playerCheckpointIds: string[]) {
    let checklist: Checklist[] = [];
    const playerTags = getPlayerTags()
    const mapName = getMapName()

    console.log("Processing areas...")
    checkpoints.forEach(checkpoint => {
        // checkpoints of the player across maps
        if (filterCheckpointsByTag(checkpoint, playerTags)) {
            const isPassed = playerCheckpointIds.includes(checkpoint.id);
            checklist.push({
                id: checkpoint.id,
                title: checkpoint.title,
                done: isPassed,
            });

            // checkpoints to place on the current map + additional filtering
            if (filterCheckpointsByMap(checkpoint, mapName) &&
            filterCheckpointsByMilestone(checkpoint, playerCheckpointIds) &&
            filterCheckpointsNPCs(checkpoint, playerCheckpointIds))
            {
                placeArea(checkpoint)
                placeTile(checkpoint)
            }  
        }  
    });

    saveChecklist(checklist)
}

function placeArea(checkpoint: CheckpointDescriptor) {
    console.log(`Placing checkpoint ${checkpoint.id} (area)`)
    const tileSize = 32
    const areaSize = 128
    const tileOriginX = checkpoint.coordinates.x * tileSize
    const tileOriginY = checkpoint.coordinates.y * tileSize
  
    // Draw the area rectangle around the tile
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
        console.log("Entered checkpoint area", checkpoint.id)
        if (checkpoint.type === "NPC" && checkpoint.message) {
            openDialogueBox(checkpoint.id)
        } else if (checkpoint.type === "content" && checkpoint.url) {
            openWebsite(checkpoint.url)
        } else if (checkpoint.type === "direction" && checkpoint.message) {
            openDialogueBox(checkpoint.id)
        }
    });

    WA.room.area.onLeave(checkpoint.id).subscribe(() => {
        console.log("Leaved checkpoint area", checkpoint.id)
        if (checkpoint.type === "NPC") {
            closeDialogueBox()
        } else if (checkpoint.type === "content") {
            closeWebsite()
            removeContentTile(checkpoint.coordinates.x, checkpoint.coordinates.y)
            passCheckpoint(checkpoint.id)
        } else if (checkpoint.type === "direction") {
            // If the game talks with the player, only consider the checkpoint done if the player has read the dialogue
            if (checkpoint.message) {
                closeDialogueBox()
            } else {
                WA.room.area.delete(checkpoint.id)
                removeDirectionTile(checkpoint.coordinates.x, checkpoint.coordinates.y)
                passCheckpoint(checkpoint.id)
            }
        }
    });
}

function filterCheckpointsByMap(checkpoint: CheckpointDescriptor, mapName: MapName): boolean {
    const checkpointId = checkpoint.id

    if (mapName !== checkpoint.map) {
        console.log(`Ignoring checkpoint ${checkpointId} (not the right map)`)
        return false
    }

    // Player can access view and access this checkpoint
    return true
}

function filterCheckpointsByTag(checkpoint: CheckpointDescriptor, playerTags: Tag[]): boolean {
    const checkpointId = checkpoint.id

    if (checkpoint.tags && checkpoint.tags.every(tag => !playerTags.includes(tag))) {
        // At least one tag of the checkpoint matches any of the player's tags
        console.log(`Ignoring checkpoint ${checkpointId} (not the right tags)`)
        return false
    }

    // Player can access view and access this checkpoint
    return true
}

function filterCheckpointsByMilestone(checkpoint: CheckpointDescriptor, playerCheckpointIds: string[]): boolean {
    const checkpointId = checkpoint.id

    if (isCheckpointAfterFirstJonas(checkpointId)) {
        if (!hasPlayerMetJonas(playerCheckpointIds)) {
            console.log(`Ignoring checkpoint ${checkpointId} (not the right milestone)`)
            return false
        }
    }

    if (isCheckpointAfterOnboarding(checkpointId)) {
        if (!isOnboardingDone(playerCheckpointIds)) {
            console.log(`Ignoring checkpoint ${checkpointId} (not the right milestone)`)
            return false
        }
    }

    // Player can access view and access this checkpoint
    return true
}

function filterCheckpointsNPCs(checkpoint: CheckpointDescriptor, playerCheckpointIds: string[]): boolean {
    const checkpointId = checkpoint.id

    if (playerCheckpointIds.includes(checkpoint.id)) {
        // player already passed this checkpoint

        // Don't display passed Jonas NPCs
        if (checkpoint.type === "NPC" && checkpoint.npcName as NPCs === "Jonas") {
            console.log(`Ignoring checkpoint ${checkpointId} (already met this Jonas)`)
            return false
        }

        // Don't display passed directions
        if (checkpoint.type === "direction") {
            console.log(`Ignoring checkpoint ${checkpointId} (already passed this direction)`)
            return false
        }
    } else {
         // player did not pass this checkpoint
         // display only next Jonas, not others in the future
        if (checkpoint.type === "NPC" && checkpoint.npcName as NPCs === "Jonas") {
            if (isNextJonasPlaced) {
                console.log(`Ignoring checkpoint ${checkpointId} (next Jonas is already placed)`)
                return false
            }

            isNextJonasPlaced = true
        }
    }

    return true
}