/// <reference types="@workadventure/iframe-api-typings" />
console.log('Main script started successfully');

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

import type { Tag } from "./Onboarding/Type/Tags"
import type { Map } from "./Onboarding/Type/Maps"
import { employees, everyone } from "./Onboarding/Data/Tags"
import { initCheckpoints, registerCloseDialogueBoxListener } from "./Onboarding/Services/CheckpointsManager"
import { displayChecklistButton, initRootURL } from "./Onboarding/Services/UIManager";
import { initDoors } from "./Onboarding/Services/DoorsManager";
import { initTown } from "./Onboarding/Maps/Town";
import { initWorld } from "./Onboarding/Maps/World";
import { processAreas } from "./Onboarding/Services/AreasManager";
import { getCheckpointIds, setCheckpointIds } from "./Onboarding/Helpers/Checkpoints";

WA.onInit().then(async () => {
    console.log('Scripting API ready');
    
    const playerTags = WA.player.tags as Tag[]
    console.log('Player tags: ', playerTags)

    const hasMatchingTag = playerTags.some(tag => everyone.includes(tag));

    bootstrapExtra().then(async () => {
        console.log('Scripting API Extra ready');
        const map = WA.state.map as Map
        const playerCheckpointIds = await getCheckpointIds()
        await initRootURL()
        registerCloseDialogueBoxListener()

        if (hasMatchingTag) {
            // WA.controls.disableInviteButton();        
            initDoors(map, playerTags, playerCheckpointIds)

            // Prevent starting the onboarding if employee
            // TODO: uncomment/comment the condition if you need to test the onboarding process locally
            if (!playerTags.some(tag => employees.includes(tag))) {
                // TODO: uncomment when this method is in prod
                // WA.controls.disableMapEditor();
                // WA.controls.disableScreenSharing();
                // WA.controls.disableWheelZoom();
                // WA.controls.disableScreenSharing();
                displayChecklistButton()

                const playerCheckpointIdsInit = await initCheckpoints(playerCheckpointIds)
                processAreas(playerCheckpointIdsInit)
            }

            // Load specific map scripts
            if (map === "town") {
                initTown()
            } else if (map === "world") {
                initWorld(playerTags, playerCheckpointIds)
            }
       
        } else {
            console.log("No player tag recognized.")
            // redirect unknown user to Town if he arrives in World
            if (map === "world") {
                console.log("Player can't access this room.")
                WA.nav.goToRoom("/@/bedrock-1710774685/onboardingbr/town")
            }

            initDoors(map, playerTags, playerCheckpointIds)
        }

        // TODO: Remove this after (add button to change progress just for debug)
        if (WA.player.name === "Valdo") {
            WA.ui.actionBar.addButton({
                id: 'start',
                label: 'Start',
                callback: () => {
                    setCheckpointIds([])
                }
            });
            WA.ui.actionBar.addButton({
                id: 'world',
                label: 'World',
                callback: () => {
                    setCheckpointIds(Array.from({ length: 4 }, (_, index) => (index + 1).toString()))
                }
            });
            WA.ui.actionBar.addButton({
                id: 'bridge',
                label: 'Bridge',
                callback: () => {
                    setCheckpointIds(Array.from({ length: 13 }, (_, index) => (index + 1).toString()))
                }
            });
            WA.ui.actionBar.addButton({
                id: 'airport',
                label: 'Airport',
                callback: () => {
                    setCheckpointIds(Array.from({ length: 22 }, (_, index) => (index + 1).toString()))
                }
            });
            WA.ui.actionBar.addButton({
                id: 'town',
                label: 'Town',
                callback: () => {
                    setCheckpointIds(Array.from({ length: 32 }, (_, index) => (index + 1).toString()))
                }
            });
            WA.ui.actionBar.addButton({
                id: 'onboarding',
                label: 'Onboarding',
                callback: () => {
                    setCheckpointIds(Array.from({ length: 34 }, (_, index) => (index + 1).toString()))
                }
            });
            WA.ui.actionBar.addButton({
                id: 'finish',
                label: 'Finish',
                callback: () => {
                    setCheckpointIds(Array.from({ length: 45 }, (_, index) => (index + 1).toString()))
                }
            });
        }
    }).catch(e => console.error(e));
}).catch(e => console.error(e));

export {};
