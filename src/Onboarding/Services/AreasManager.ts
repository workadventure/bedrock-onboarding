/// <reference types="@workadventure/iframe-api-typings" />

import { checkpoints } from "../Constants/Checkpoints";
import { Checklist, CheckpointDescriptor, type NPC } from "../Types/Checkpoints";
import { currentMapStore } from "../State/Properties/CurrentMapStore";
import { playerTagsStore } from "../State/Properties/PlayerTagsStore";
import { checkpointIdsStore } from "../State/Properties/CheckpointIdsStore";
import { checklistStore } from "../State/Properties/ChecklistStore";
import { closeDialogueBox, closeWebsite, openCheckpointBanner, openDialogueBox, openWebsite } from "./UIManager";
import { removeContentTile, removeDirectionTile } from "./TilesManager";
import { passCheckpoint, placeCheckpoint } from "./CheckpointsManager";

let isNextJonasPlaced = false

export async function processAreas() {
    const checklist: Checklist[] = [];

    console.log("Processing areas...")
    checkpoints.forEach(checkpoint => {
        // checkpoints of the player across maps
        if (filterCheckpointsByTag(checkpoint)) {
            checklist.push({
                id: checkpoint.id,
                title: checkpoint.title,
                done: checkpointIdsStore.isCheckpointPassed(checkpoint.id),
            });

            // checkpoints to place on the current map + additional filtering
            if (filterCheckpointsByMap(checkpoint) &&
                filterCheckpointsByMilestone(checkpoint) &&
                filterCheckpointsNPCs(checkpoint)) {
                placeCheckpoint(checkpoint)
            }
        }
    });

    await checklistStore.setAsyncState(checklist)
    const nextCheckpointId = checkpointIdsStore.getNextCheckpointId(checklist)
    openCheckpointBanner(nextCheckpointId)
}

export function placeArea(checkpoint: CheckpointDescriptor) {
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

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    WA.room.area.onEnter(checkpoint.id).subscribe(async () => {
        console.log("Entered checkpoint area", checkpoint.id)
        if (checkpoint.type === "NPC" && checkpoint.message) {
            await openDialogueBox(checkpoint.id)
        } else if (checkpoint.type === "content" && checkpoint.url) {
            await openWebsite(checkpoint.url)
        } else if (checkpoint.type === "direction" && checkpoint.message) {
            await openDialogueBox(checkpoint.id)
        }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    WA.room.area.onLeave(checkpoint.id).subscribe(async () => {
        console.log("Leaved checkpoint area", checkpoint.id)
        if (checkpoint.type === "NPC") {
            await closeDialogueBox()
            if (checkpoint.url) {
                await closeWebsite()
            }
        } else if (checkpoint.type === "content") {
            await removeContentTile(checkpoint)
            await passCheckpoint(checkpoint.id)
            // Don't close smartphone checkpoint automatically in order to
            // prevent passing on it without seeing its content (user MUST close the website manually)
            if (checkpointIdsStore.isCheckpointJonasPhone(checkpoint.id)) return
            await closeWebsite()
        } else if (checkpoint.type === "direction") {
            // If the game talks with the player, only consider the checkpoint done if the player has read the dialogue
            if (checkpoint.message) {
                await closeDialogueBox()
            } else {
                await WA.room.area.delete(checkpoint.id)
                removeDirectionTile(checkpoint)
                await passCheckpoint(checkpoint.id)
            }
        }
    });
}

function filterCheckpointsByMap(checkpoint: CheckpointDescriptor): boolean {
    const checkpointId = checkpoint.id

    if (currentMapStore.getState() !== checkpoint.map) {
        console.log(`Ignoring checkpoint ${checkpointId} (not the right map)`)
        return false
    }

    // Player can access view and access this checkpoint
    return true
}

function filterCheckpointsByTag(checkpoint: CheckpointDescriptor): boolean {
    const checkpointId = checkpoint.id
    const checkpointTags = checkpoint.tags

    console.log("Filter checkpoint: ", checkpoint.title)
    if (checkpointTags && !playerTagsStore.hasMandatoryTagsIn(checkpointTags)) {
        // At least one tag of the checkpoint matches any of the player's tags
        console.log(`Ignoring checkpoint ${checkpointId} (not the right tags)`)
        return false
    }

    // Player can access view and access this checkpoint
    return true
}

function filterCheckpointsByMilestone(checkpoint: CheckpointDescriptor): boolean {
    const checkpointId = checkpoint.id

    if (checkpointIdsStore.isCheckpointJonasPhone(checkpointId)) {
        // If player did not speak with Jonas yet in the World cave
        if (!checkpointIdsStore.hasPlayerTalkedWithJonasInTheCave() || checkpointIdsStore.canLeaveCaveWorld()) {
            console.log(`Ignoring checkpoint ${checkpointId} (milestone Jonas phone)`)
            return false
        }
    }

    if (checkpointIdsStore.isCheckpointAfterFirstJonas(checkpointId)) {
        if (!checkpointIdsStore.hasPlayerMetJonas()) {
            console.log(`Ignoring checkpoint ${checkpointId} (milestone meet Jonas)`)
            return false
        }
    }

    if (checkpointIdsStore.isLockedCheckpointAfterOnboarding(checkpointId)) {
        if (!checkpointIdsStore.isWorldMapDone()) {
            console.log(`Ignoring checkpoint ${checkpointId} (milestone onboarding)`)
            return false
        }
    }

    // Player can access view and access this checkpoint
    return true
}

function filterCheckpointsNPCs(checkpoint: CheckpointDescriptor): boolean {
    const checkpointId = checkpoint.id

    if (checkpointIdsStore.isCheckpointPassed(checkpointId)) {
        // player already passed this checkpoint

        // Don't display passed Jonas NPCs
        if (checkpoint.type === "NPC" && checkpoint.npcName as NPC === "Jonas") {
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
        if (checkpoint.type === "NPC" && checkpoint.npcName as NPC === "Jonas") {
            console.log("*****************")
            console.log("Jonas checkpoint", checkpoint.id)
            if (isNextJonasPlaced) {
                console.log(`Ignoring checkpoint ${checkpointId} (next Jonas is already placed)`)
                return false
            }

            console.log("place this Jonas")
            isNextJonasPlaced = true
        }
    }

    return true
}