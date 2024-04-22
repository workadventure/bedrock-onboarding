/// <reference types="@workadventure/iframe-api-typings" />

console.log('Main script started successfully');

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

import { registerCloseDialogueBoxListener } from "./Onboarding/Services/CheckpointsManager"
import { displayChecklistButton } from "./Onboarding/Services/UIManager";
import { townMapUrl } from "./Onboarding/Constants/Maps";
import { initDoors } from "./Onboarding/Services/DoorsManager";
import { initTown } from "./Onboarding/Maps/Town";
import { initWorld } from "./Onboarding/Maps/World";
import { processAreas } from "./Onboarding/Services/AreasManager";
import { currentMapStore } from "./Onboarding/State/Properties/CurrentMapStore";
import { playerTagsStore } from "./Onboarding/State/Properties/PlayerTagsStore";
import { rootUrlStore } from "./Onboarding/State/Properties/RootUrlStore";
import { checkpointIdsStore } from "./Onboarding/State/Properties/CheckpointIdsStore";

WA.onInit().then(() => {
    console.log('*******************');
    console.log('Scripting API ready');

    currentMapStore.initState();
    playerTagsStore.initState();
    rootUrlStore.initState();

    bootstrapExtra().then(async () => {
        console.log('Scripting API Extra ready');

        await checkpointIdsStore.initAsyncState();
        // checklistStore is initialized when looping through the checkpoints in AreasManager.ts
  
        registerCloseDialogueBoxListener()

        if (playerTagsStore.hasMandatoryTags()) {
            // FIXME: wait for the new controls API to be released
            // WA.controls.disableInviteButton();
            // WA.controls.disableMapEditor();
            // WA.controls.disableScreenSharing();
            // WA.controls.disableWheelZoom();
            // WA.controls.disableScreenSharing();

            initDoors()

            // Do the onboarding only for players with at least one newbie tag
            if (playerTagsStore.isNewbie()) {
                displayChecklistButton()

                await processAreas()
    
                // Load specific map scripts
                if (currentMapStore.isTown()) {
                    initTown()
                } else if (currentMapStore.isWorld()) {
                    initWorld()
                }
            }
       
        } else {
            console.log("No player tag recognized.")
            // redirect unknown user to Town if he arrives in World
            if (currentMapStore.isWorld()) {
                console.log("Player can't access this room.")
                WA.nav.goToRoom(townMapUrl)
            }

            initDoors()
        }

        // TODO: Remove this after (add button to change progress just for debug)
        if (WA.player.name === "Valdo") {
            WA.ui.actionBar.addButton({
                id: 'start',
                label: 'Start',
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                callback: async () => {
                    await checkpointIdsStore.setAsyncState([])
                }
            });
            WA.ui.actionBar.addButton({
                id: 'world',
                label: 'World',
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                callback: async () => {
                    await checkpointIdsStore.setAsyncState(Array.from({ length: 4 }, (_, index) => (index + 1).toString()))
                }
            });
            WA.ui.actionBar.addButton({
                id: 'bridge',
                label: 'Bridge',
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                callback: async () => {
                    await checkpointIdsStore.setAsyncState(Array.from({ length: 13 }, (_, index) => (index + 1).toString()))
                }
            });
            WA.ui.actionBar.addButton({
                id: 'airport',
                label: 'Airport',
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                callback: async () => {
                    await checkpointIdsStore.setAsyncState(Array.from({ length: 22 }, (_, index) => (index + 1).toString()))
                }
            });
            WA.ui.actionBar.addButton({
                id: 'town',
                label: 'Town',
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                callback: async () => {
                    await checkpointIdsStore.setAsyncState(Array.from({ length: 32 }, (_, index) => (index + 1).toString()))
                }
            });
            WA.ui.actionBar.addButton({
                id: 'onboarding',
                label: 'Onboarding',
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                callback: async () => {
                    await checkpointIdsStore.setAsyncState(Array.from({ length: 34 }, (_, index) => (index + 1).toString()))
                }
            });
            WA.ui.actionBar.addButton({
                id: 'finish',
                label: 'Finish',
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                callback: async () => {
                    await checkpointIdsStore.setAsyncState(Array.from({ length: 45 }, (_, index) => (index + 1).toString()))
                }
            });
        }
    }).catch(e => console.error(e));
}).catch(e => console.error(e));

export {};
