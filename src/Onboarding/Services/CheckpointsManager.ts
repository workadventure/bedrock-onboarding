import { levelUp } from "@workadventure/quests";
import { checkpoints } from "../Constants/Checkpoints"
import { travelFromAirportToRooftop } from "../Maps/World"
import { CheckpointDescriptor } from "../Types/Checkpoints"
import { pause } from "../Utils/Utils";
import { checkpointIdsStore } from "../State/Properties/CheckpointIdsStore"
import { checklistStore } from "../State/Properties/ChecklistStore"
import { townMapUrl } from "../Constants/Maps"
import { placeArea, processAreas, removeArea } from "./AreasManager"
import { getCaveDoorToOpen, unlockAirportGate, unlockBrTowerFloorAccess, unlockTownBuildingDoor, unlockTownCaveDoor, unlockWorldBarrier, unlockWorldBuildingDoor } from "./DoorsManager"
import { placeTile, removeDirectionTile, removeNPCTile, teleportJonas } from "./TilesManager"
import { closeBanner, openCheckpointBanner, openErrorBanner, openWebsite, openFeedbackForm } from "./UIManager"

const QUEST_KEY = "bedrock-journey";
const LAST_XP_AMOUNT_REQUIRED = 20;

export function placeCheckpoint(checkpoint: CheckpointDescriptor) {
    placeArea(checkpoint)
    placeTile(checkpoint)
}

function placeNextJonasCheckpoint() {
    console.log("========================")
    console.log("placeNextJonasCheckpoint()")
    const nextJonasCheckpointId = checkpointIdsStore.getNextJonasCheckpointId()
    console.log("nextJonasCheckpointId",nextJonasCheckpointId)
    const checkpoint = checkpoints.find(c => c.id === nextJonasCheckpointId)
    console.log("checkpoint",checkpoint)
    if (checkpoint) {
        console.log("placeCheckpoint")
        placeCheckpoint(checkpoint)
    }
}

export async function passCheckpoint(checkpointId: string) {
    closeBanner()

    // Affect checkpoint only if it has not been passed already
    if (checkpointIdsStore.isCheckpointPassed(checkpointId)) {
        console.log("(State: unchanged) Old checkpoint passed", checkpointId)
    } else {
        console.log("(State: update) New checkpoint passed", checkpointId);

        await checkpointIdsStore.addCheckpointId(checkpointId);
        await grantQuestXP(checkpointIdsStore.getCheckpointXP(checkpointId))
        await checklistStore.markCheckpointAsDone(checkpointId);
        await triggerCheckpointAction(checkpointId);
        const checklist = checklistStore.getState();
        openCheckpointBanner(checkpointIdsStore.getNextCheckpointId(checklist))
    }
}

async function grantQuestXP(xp: number) {
    console.log("grantQuestXP",xp)
    try {
        await levelUp(QUEST_KEY, xp)
    } catch (e) {
        console.warn("Error while granting XP", e)
    }
}

// When the dialogue box is closed, this event is fired
export function registerCloseDialogueBoxListener() {
    interface CloseDialogueBoxVariable {
        forceChange: number;
        checkpoint: CheckpointDescriptor|null;
    }

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    WA.player.state.onVariableChange('closeDialogueBoxEvent').subscribe(async (value) => {
        const checkpointData = value as CloseDialogueBoxVariable;
        const checkpoint = checkpointData.checkpoint;

        if (checkpoint) {
            console.log('Variable "closeDialogueBoxEvent" changed. New value: ', checkpoint);
            // If the NPC has a content to show after the dialogue box is closed, open the content
            if (checkpoint.url) {
                console.log("Open URL",checkpoint.url)
                await openWebsite(checkpoint.url)
            }
        
            // If it's Jonas, remove its area and teleport him
            if (checkpoint.npcName === "Jonas") {
                await removeArea(checkpoint.id)
        
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
                await removeArea(checkpoint.id)
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
            await processAreas()
            break;

        // Requirement: Read the cave PC dialogue
        case "4": {
            // Action: Unlock Town cave door
            const door = getCaveDoorToOpen();
            if (door) {
                unlockTownCaveDoor(door);
            } else {
                openErrorBanner();
            }
            break;
        }

        // Requirement: Talk to Jonas in the cave
        case "6": {
            // Action: Place Jonas' phone + place next Jonas
            const checkpoint6 = checkpoints.find(c => c.id === "7")
            if (checkpoint6) {
                placeCheckpoint(checkpoint6)
            }
            placeNextJonasCheckpoint()
            break;
        }

        // Requirement: Watch Jonas' phone video
        case "7":
            // Action: Unlock World cave door
            unlockWorldBuildingDoor("cave")
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

        // Requirement: Talk to Jonas about Customer Success
        case "13":
            // Action: Unlock access to France + place next Jonas
            unlockWorldBarrier("france")
            placeNextJonasCheckpoint()
            break;

        // Requirement: Watch 6play video 1 or 2
        case "14":
        case "15":
            // Action: Unlock access to Hungary if either 14 or 15 is done
            if (checkpointIdsStore.canAccessHungary()) {
                unlockWorldBarrier("hungary")
            }
            break;
    
        // Requirement: Watch RTL+ video 1 or 2
        case "16":
        case "17":
            // Action: Unlock access to Belgium if either 16 or 17 is done
            if (checkpointIdsStore.canAccessBelgium()) {
                unlockWorldBarrier("belgium")
            }
            break;
    
        // Requirement: Watch RTL Play video 1 or 2
        case "18":
        case "19":
            // Action: Unlock access to Netherlands if either 18 or 19 is done
            if (checkpointIdsStore.canAccessNetherlands()) {
                unlockWorldBarrier("netherlands")
            }

            break;
    
        // Requirement: Watch Videoland video 1 or 2
        case "20":
        case "21":
            // Action: Unlock access to airport if either 20 or 21 is done
            if (checkpointIdsStore.canEnterAirport()) {
                unlockWorldBuildingDoor("airport")
            }
            break;

        // Requirement: Talk to check-in guy
        case "22":
            // Action: Unlock airport boarding gate
            unlockAirportGate()
            break;

        // Requirement: Talk to Jonas near the Helicopter
        case "23":
            // Action: Fly to the BR Tower rooftop + place next Jonas
            await travelFromAirportToRooftop()
            console.log("TRAVEL FINISHED")
            placeNextJonasCheckpoint()
            break;

        // Requirement: Talk to Jonas on the BR Tower rooftop
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

        // Requirement: Talk to Jonas at its Pickup
        case "31":
            // Action: Place next Jonas (but wait a little bit for the current Jonas to disappear)
            await pause(1000)
            placeNextJonasCheckpoint()
            break;

        // Requirement: Enter Jonas' Pickup
        case "32":
            // Action: Go to room Town before backstage
            WA.nav.goToRoom(`${townMapUrl}#from-tower`)
            break;

        // Requirement: Talk to Jonas in the backstage or check backstage content
        case "33":
        case "34":
            // Action: Unlock rest of the buildings + place next and last Jonas
            if (checkpointIdsStore.isBackstageDone()) {
                placeNextJonasCheckpoint()
                unlockTownBuildingDoor("backstage")
                unlockTownBuildingDoor("arcade")
                unlockTownBuildingDoor("streaming")
                unlockTownBuildingDoor("wikitech")
            }
            break;

        // Requirement: Check some FR content
        case "39":
        case "40":
        case "41":
            // Action: Finish onboarding
            if (checkpointIdsStore.isContentFRChecked()) {
                // give XP for final badge and open feedback form
                await finishOnboarding()
            }
            break;

        // Requirement: Check some PT content
        case "42":
        case "43":
        case "44":
            // Action: Finish onboarding
            if (checkpointIdsStore.isContentPTChecked()) {
                // give XP for final badge and open feedback form
                await finishOnboarding()
            }
            break;

        // Requirement: Check some ALT content
        case "45":
        case "46":
        case "47":
            // Action: Finish onboarding
            if (checkpointIdsStore.isContentALTChecked()) {
                // give XP for final badge and open feedback form
                await finishOnboarding()
            }
            break;

        // Requirement: Check some EXT content
        case "48":
        case "49":
            // Action: Finish onboarding
            if (checkpointIdsStore.isContentEXTChecked()) {
                // give XP for final badge and open feedback form
                await finishOnboarding()
            }
            break;

        default:
            break;
    }
}

async function finishOnboarding() {
    await grantQuestXP(LAST_XP_AMOUNT_REQUIRED)
    openFeedbackForm()
}
