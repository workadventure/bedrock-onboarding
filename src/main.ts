/// <reference types="@workadventure/iframe-api-typings" />
console.log('Main script started successfully');

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

import { initTown } from "./town";
import { initWorld } from "./world";
import { initOnboarding } from "./onboarding/index";
import { displayChecklistButton } from "./onboarding/ui";
import { initDoors } from "./doors";
import { getCheckpointIds, type Tag, everyone, saveCheckpointIds } from "./onboarding/checkpoints";

export type MapName = "town" | "world";

WA.onInit().then(() => {
    console.log('Scripting API ready');
    
    const playerTags = WA.player.tags as Tag[]
    console.log('Player tags: ', playerTags)

    const hasMatchingTag = playerTags.some(tag => everyone.includes(tag));

    bootstrapExtra().then(async () => {
        console.log('Scripting API Extra ready');
        const map = WA.state.map as MapName
        const playerCheckpointIds = await getCheckpointIds()

        if (hasMatchingTag) {
            // TODO: uncomment when this method is in prod
            // WA.controls.disableMapEditor();
            // WA.controls.disableScreenSharing();
            // WA.controls.disableWheelZoom();
            // WA.controls.disableScreenSharing();
            // WA.controls.disableInviteButton();
            displayChecklistButton()

            initDoors(map, playerTags, playerCheckpointIds)
            initOnboarding()

            // Load specific map scripts
            if (map === "town") {
                initTown()
            } else if (map === "world") {
                initWorld(playerCheckpointIds)
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

        // TMP: add button o change progress just for dev
        if (WA.player.name === "Valdo") {
            WA.ui.actionBar.addButton({
                id: 'start',
                label: 'Start',
                callback: () => {
                    saveCheckpointIds([])
                }
            });
            WA.ui.actionBar.addButton({
                id: 'world',
                label: 'World',
                callback: () => {
                    saveCheckpointIds(Array.from({ length: 4 }, (_, index) => (index + 1).toString()))
                }
            });
            WA.ui.actionBar.addButton({
                id: 'bridge',
                label: 'Bridge',
                callback: () => {
                    saveCheckpointIds(Array.from({ length: 13 }, (_, index) => (index + 1).toString()))
                }
            });
            WA.ui.actionBar.addButton({
                id: 'airport',
                label: 'Airport',
                callback: () => {
                    saveCheckpointIds(Array.from({ length: 23 }, (_, index) => (index + 1).toString()))
                }
            });
            WA.ui.actionBar.addButton({
                id: 'onboarding',
                label: 'Onboarding',
                callback: () => {
                    saveCheckpointIds(Array.from({ length: 34 }, (_, index) => (index + 1).toString()))
                }
            });
            WA.ui.actionBar.addButton({
                id: 'finish',
                label: 'Finish',
                callback: () => {
                    saveCheckpointIds(Array.from({ length: 45 }, (_, index) => (index + 1).toString()))
                }
            });
        }
    }).catch(e => console.error(e));
}).catch(e => console.error(e));

export {};
