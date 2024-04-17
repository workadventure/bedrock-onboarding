/// <reference types="@workadventure/iframe-api-typings" />

import { checkpoints, checkpointIdsAfterOnboarding } from "../Data/Checkpoints";
import { canLeaveCaveWorld, getNextCheckpointId, hasPlayerMetJonas, hasPlayerTalkedWithJonasInTheCave, isCheckpointAfterFirstJonas, isCheckpointAfterOnboarding, isCheckpointJonasPhone, isCheckpointPassed, isOnboardingDone, setChecklist } from "../Helpers/Checkpoints";
import { getMapName } from "../Helpers/Maps";
import { getPlayerTags } from "../Helpers/Tags";
import { Checklist, CheckpointDescriptor, type NPC } from "../Type/Checkpoints";
import type { Map } from "../Type/Maps";
import type { Tag } from "../Type/Tags";
import { passCheckpoint, placeCheckpoint } from "./CheckpointsManager";
import { removeContentTile, removeDirectionTile } from "./TilesManager";
import { closeDialogueBox, closeWebsite, openCheckpointBanner, openDialogueBox, openWebsite } from "./UIManager";

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
                filterCheckpointsByMilestone(checkpoint, playerCheckpointIds, playerTags) &&
                filterCheckpointsNPCs(checkpoint, playerCheckpointIds)) {
                placeCheckpoint(checkpoint)
            }
        }
    });

    setChecklist(checklist)
    openCheckpointBanner(getNextCheckpointId(checklist))
}

export function processAreasAfterOnboarding(playerCheckpointIds: string[]) {
    const playerTags = getPlayerTags()

    console.log("Processing areas after on boarding...")
    console.log("checkpointIdsAfterOnboarding",checkpointIdsAfterOnboarding)
    // we only need to filter by tag (for the Wikitek content) since we don't have restrictions at this point
    checkpointIdsAfterOnboarding.forEach((checkpointId) => {
        const checkpoint = checkpoints.find(c => c.id === checkpointId)
        if (checkpoint) {
            if (filterCheckpointsByTag(checkpoint, playerTags)) {
                // Ignore if checkpoint is not already done
                if (!isCheckpointPassed(playerCheckpointIds, checkpointId)) {
                    placeCheckpoint(checkpoint)
                }
            }
        }
    })
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
            removeContentTile(checkpoint)
            passCheckpoint(checkpoint.id)
        } else if (checkpoint.type === "direction") {
            // If the game talks with the player, only consider the checkpoint done if the player has read the dialogue
            if (checkpoint.message) {
                closeDialogueBox()
            } else {
                WA.room.area.delete(checkpoint.id)
                removeDirectionTile(checkpoint)
                passCheckpoint(checkpoint.id)
            }
        }
    });
}

function filterCheckpointsByMap(checkpoint: CheckpointDescriptor, mapName: Map): boolean {
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
    const checkpointTags = checkpoint.tags

    console.log("*********",checkpoint.title)
    console.log("playerTags",playerTags)
    console.log("checkpointTags",checkpointTags)
    console.log("playerTags.some(tag => checkpointTags.includes(tag)",playerTags.some(tag => checkpointTags?.includes(tag)))
    if (checkpointTags && !playerTags.some(tag => checkpointTags.includes(tag))) {
        // At least one tag of the checkpoint matches any of the player's tags
        console.log(`Ignoring checkpoint ${checkpointId} (not the right tags)`)
        return false
    }

    // Player can access view and access this checkpoint
    return true
}

function filterCheckpointsByMilestone(checkpoint: CheckpointDescriptor, playerCheckpointIds: string[], playerTags: Tag[]): boolean {
    const checkpointId = checkpoint.id

    if (isCheckpointJonasPhone(checkpointId)) {
        // If player did not speak with Jonas yet in the World cave
        if (!hasPlayerTalkedWithJonasInTheCave(playerCheckpointIds) || canLeaveCaveWorld(playerCheckpointIds)) {
            console.log(`Ignoring checkpoint ${checkpointId} (milestone Jonas phone)`)
            return false
        }
    }

    if (isCheckpointAfterFirstJonas(checkpointId)) {
        // Guests can not meet Jonas so we allow them to see the last checkpoints not restricted by tags
        if (!hasPlayerMetJonas(playerCheckpointIds) && !playerTags.includes("guest")) {
            console.log(`Ignoring checkpoint ${checkpointId} (milestone meet Jonas)`)
            return false
        }
    }

    if (isCheckpointAfterOnboarding(checkpointId)) {
        // Guests can not complete the onboarding so we allow them to see the last checkpoints not restricted by tags
        if (!isOnboardingDone(playerCheckpointIds) && !playerTags.includes("guest")) {
            console.log(`Ignoring checkpoint ${checkpointId} (milestone onboarding)`)
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
            if (isNextJonasPlaced) {
                console.log(`Ignoring checkpoint ${checkpointId} (next Jonas is already placed)`)
                return false
            }

            isNextJonasPlaced = true
        }
    }

    return true
}