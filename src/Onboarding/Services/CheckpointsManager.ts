import { checkpoints } from "../Data/Checkpoints"
import { canAccessBelgium, canAccessHungary, canAccessNetherlands, canEnterAirport, canLeaveBackstage, getChecklist, getCheckpointIds, getNextCheckpointId, getNextJonasCheckpointId, isCheckpointPassed, setChecklist, setCheckpointIds } from "../Helpers/Checkpoints"
import { getPlayerTags } from "../Helpers/Tags"
import { travelFromAirportToRooftop } from "../Maps/World"
import { CheckpointDescriptor } from "../Type/Checkpoints"
import { placeArea, processAreas, processAreasAfterOnboarding } from "./AreasManager"
import { getCaveDoorToOpen, unlockAirportGate, unlockBrTowerFloorAccess, unlockTownBuildingDoor, unlockTownCaveDoor, unlockWorldBarrier, unlockWorldBuildingDoor } from "./DoorsManager"
import { placeTile, removeDirectionTile, removeNPCTile, teleportJonas } from "./TilesManager"
import { DOOR_LOCKED, closeBanner, openCheckpointBanner, openErrorBanner, openWebsite } from "./UIManager"
import { pause } from "../Helpers/Utils";

export async function initCheckpoints(playerCheckpointIds: string[]): Promise<string[]> {
    if (playerCheckpointIds.length > 1) {
        // Existing player
        console.log("Existing player. Checkpoint IDs: ", playerCheckpointIds)
    } else {
        // New player
        console.log("New player.")
        setCheckpointIds(["0"])
        return ["0"]
    }

    return playerCheckpointIds
}

export function placeCheckpoint(checkpoint: CheckpointDescriptor) {
    placeArea(checkpoint)
    placeTile(checkpoint)
}

async function placeNextJonasCheckpoint() {
    const playerCheckpointIds = await getCheckpointIds()
    const checkpoint = checkpoints.find(c => c.id === getNextJonasCheckpointId(playerCheckpointIds))
    if (checkpoint) {
        placeCheckpoint(checkpoint)
    }
}

export async function passCheckpoint(checkpointId: string) {
    closeBanner()

    const playerCheckpointIds = await getCheckpointIds()
    const checklist = await getChecklist()

    // Affect checkpoint only if it has not been passed already
    if (isCheckpointPassed(playerCheckpointIds, checkpointId)) {
        console.log("(State: unchanged) Old checkpoint passed", checkpointId)
    } else {
        console.log("(State: update) New checkpoint passed", checkpointId);

        playerCheckpointIds.push(checkpointId)
        setCheckpointIds(playerCheckpointIds)

        await markCheckpointAsDone(checkpointId)
        await triggerCheckpointAction(checkpointId);
        openCheckpointBanner(getNextCheckpointId(checklist))
    }
}

async function markCheckpointAsDone(checkpointId: string) {
    let checklist = await getChecklist()

    // mark the checkpoint as done
    const checkpointIdx = checklist.findIndex(checkpoint => checkpoint.id === checkpointId)
    checklist[checkpointIdx].done = checkpointIdx !== -1;

    setChecklist(checklist)
}

// When the dialogue box is closed, this event is fired
export function registerCloseDialogueBoxListener() {
    WA.player.state.onVariableChange('closeDialogueBoxEvent').subscribe(async (value) => {
        const checkpoint = value as CheckpointDescriptor|null
        if (checkpoint) {
            console.log('Variable "closeDialogueBoxEvent" changed. New value: ', checkpoint);
            // If the NPC has a content to show after the dialogue box is closed, open the content
            if (checkpoint.url) {
                console.log("Open URL",checkpoint.url)
                openWebsite(checkpoint.url)
            }
        
            // If it's Jonas, remove its area and teleport him
            if (checkpoint.npcName === "Jonas") {
                WA.room.area.delete(checkpoint.id)
        
               // Don't teleport Jonas and don't remove it if it's the one at its Pickup or the one at the stadium stage
                if (checkpoint.id === "32" || checkpoint.id === "36") {
                    console.log("Don't move Jonas")
                } else if (checkpoint.id === "23") {
                    // Don't teleport Jonas but remove it if it's the one at the airport
                    console.log("Remove Jonas")
                    removeNPCTile(checkpoint)
                } else {
                    console.log("Teleport Jonas")
                    teleportJonas(checkpoint.coordinates.x, checkpoint.coordinates.y)
                }
            } else if (checkpoint.type === "direction") {
                console.log("Remove direction area and tile")
                WA.room.area.delete(checkpoint.id)
                removeDirectionTile(checkpoint)
            }
        
            console.log("checkpoint.id",checkpoint.id)
            await passCheckpoint(checkpoint.id)
        }
    });
}

async function triggerCheckpointAction(checkpointId: string) {
    switch (checkpointId) {
        // Requirement: Meet Jonas for the first time
        case "2":
            // Action: Place rest of checkpoints
            const playerCheckpointIds2 = await getCheckpointIds()
            processAreas(playerCheckpointIds2)
            break;
        // Requirement: Read the cave PC dialogue
        case "4":
            // Action: Unlock Town cave door
            const playerTags = getPlayerTags()
            const door = getCaveDoorToOpen(playerTags)
            if (door) {
                unlockTownCaveDoor(door)
            } else {
                openErrorBanner(DOOR_LOCKED)
            }
            break;

        // Requirement: Talk with Jonas in the cave
        case "6":
            // Action: Place Jonas' phone
            const checkpoint6 = checkpoints.find(c => c.id === "7")
            if (checkpoint6) {
                placeCheckpoint(checkpoint6)
            }
            break;

        // Requirement: Watch Jonas' phone video
        case "7":
            // Action: Unlock World cave door + place next Jonas
            unlockWorldBuildingDoor("cave")
            placeNextJonasCheckpoint()
            break;

        // Requirement: Check History content
        case "9":
            // Action: Unlock access to Achievements content
            unlockWorldBarrier("achievements")
            break;

        // Requirement: Check Achievements content
        case "10":
            // Action: Unlock access to Values content
            unlockWorldBarrier("values")
            break;

        // Requirement: Check Values content
        case "11":
            // Action: Unlock access to Legal content
            unlockWorldBarrier("legal")
            break;

        // Requirement: Check Legal content
        case "12":
            // Action: Unlock Access to bridge
            unlockWorldBarrier("bridge")
            break;

        // Requirement: Talk with Jonas about Customer Success
        case "13":
            // Action: Unlock access to France + place next Jonas
            unlockWorldBarrier("france")
            placeNextJonasCheckpoint()
            break;

        // Requirement: Watch 6play video 1 or 2
        case "14":
        case "15":
            // Action: Unlock access to Hungary if either 14 or 15 is done
            const playerCheckpointIds1415 = await getCheckpointIds()
            if (canAccessHungary(playerCheckpointIds1415)) {
                unlockWorldBarrier("hungary")
            }
            break;
    
        // Requirement: Watch RTL+ video 1 or 2
        case "16":
        case "17":
            // Action: Unlock access to Belgium if either 16 or 17 is done
            const playerCheckpointIds1617 = await getCheckpointIds()
            if (canAccessBelgium(playerCheckpointIds1617)) {
                unlockWorldBarrier("belgium")
            }
            break;
    
        // Requirement: Watch RTL Play video 1 or 2
        case "18":
        case "19":
            // Action: Unlock access to Netherlands if either 18 or 19 is done
            const playerCheckpointIds1819 = await getCheckpointIds()
            if (canAccessNetherlands(playerCheckpointIds1819)) {
                unlockWorldBarrier("netherlands")
            }

            break;
    
        // Requirement: Watch Videoland video 1 or 2
        case "20":
        case "21":
            // Action: Unlock access to airport if either 20 or 21 is done
            const playerCheckpointIds2021 = await getCheckpointIds()
            if (canEnterAirport(playerCheckpointIds2021)) {
                unlockWorldBuildingDoor("airport")
            }
            break;

        // Requirement: Talk with check-in guy
        case "22":
            // Action: Unlock airport boarding gate
            unlockAirportGate()
            break;

        // Requirement: Talk with Jonas near the Helicopter
        case "23":
            // Action: Fly to the BR Tower rooftop + place next Jonas
            await travelFromAirportToRooftop()
            console.log("TRAVEL FINISHED")
            placeNextJonasCheckpoint()
            break;

        // Requirement: Talk with Jonas on the BR Tower rooftop
        case "24":
            // Action: Unlock access to BR Tower floor 4 + place next Jonas
            unlockBrTowerFloorAccess("floor4")
            placeNextJonasCheckpoint()
            break;

        // Requirement: Check floor 4
        case "25":
            // Action: Unlock floor 3
            unlockBrTowerFloorAccess("floor3")
            break;

        // Requirement: Check floor 3
        case "26":
            // Action: Unlock floor 2
            unlockBrTowerFloorAccess("floor2")
            break;

        // Requirement: Check floor 2
        case "27":
            // Action: Unlock floor 1
            unlockBrTowerFloorAccess("floor1")
            break;

        // Requirement: Check floor 1
        case "28":
            // Action: Unlock floor 0
            unlockBrTowerFloorAccess("floor0")
            break;

        // Requirement: Check floor 0
        case "29":
            // Action: Unlock BR Tower exit door
            unlockBrTowerFloorAccess("exit")
            break;

        // Requirement: Talk with Jonas at its Pickup
        case "31":
            // Action: Place next Jonas but wait a little bit for the current Jonas to disappear
            await pause(1000)
            placeNextJonasCheckpoint()
            break;

        // Requirement: Enter Jonas' Pickup
        case "32":
            // Action: Go to room Town before backstage
            WA.nav.goToRoom("/@/bedrock-1710774685/onboardingbr/town#from-tower")
            break;

        // Requirement: Talk to Jonas in the backstage or check backstage content
        case "33":
        case "34":
            // Action: Unlock backstage door to stage if checked content + place rest of content
            const playerCheckpointIds3334 = await getCheckpointIds()
            if (canLeaveBackstage(playerCheckpointIds3334)) {
                unlockTownBuildingDoor("backstage")
                processAreasAfterOnboarding(playerCheckpointIds3334)
            }
            break;
            
        default:
            break;
    }
}
