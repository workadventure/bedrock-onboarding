/// <reference types="@workadventure/iframe-api-typings" />

console.log('Main script started successfully');

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

import { registerCloseDialogueBoxListener, initPlayerPosition } from "./Onboarding/Services/CheckpointsManager"
import { displayChecklistButton, displayHelpButton } from "./Onboarding/Services/UIManager";
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

    WA.controls.disableInviteButton();
    WA.controls.disableRightClick();
    WA.controls.disableRoomList();
    WA.controls.disableMapEditor();

    currentMapStore.initState();
    playerTagsStore.initState();
    rootUrlStore.initState();

    bootstrapExtra().then(async () => {
        console.log('Scripting API Extra ready');

        await checkpointIdsStore.initAsyncState();
        // checklistStore is initialized when looping through the checkpoints in AreasManager.ts
  
        registerCloseDialogueBoxListener()

        if (playerTagsStore.hasMandatoryTags()) {
            initPlayerPosition()
            initDoors()

            // Do the onboarding only for players with at least one newbie tag
            if (playerTagsStore.isOtherThanGuest()) {
                displayHelpButton()
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
    }).catch(e => console.error(e));
}).catch(e => console.error(e));

export {};
