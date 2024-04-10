/// <reference types="@workadventure/iframe-api-typings" />
console.log('Main script started successfully');

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

import { initTown } from "./town";
import { initWorld } from "./world";
import { initOnboarding } from "./onboarding/index";
import { displayChecklistButton } from "./onboarding/ui";
import { initDoors, closeTownDoors } from "./doors";
import { getCheckpointIds, type Tag, everyone } from "./onboarding/checkpoints";

export type MapName = "town" | "world";

WA.onInit().then(() => {
    console.log('Scripting API ready');

    const playerTags = WA.player.tags as Tag[]
    console.log('Player tags: ', playerTags)

    const hasMatchingTag = playerTags.some(tag => everyone.includes(tag));

    bootstrapExtra().then(async () => {
        console.log('Scripting API Extra ready');
        const map = WA.state.map as MapName

        if (hasMatchingTag) {
            // @ts-ignore
            WA.controls.disableInviteButton();
            displayChecklistButton()
    
            // Load specific map scripts
            if (map === "town") {
                initTown()
            } else if (map === "world") {
                initWorld()
            }
            
            const playerCheckpointIds = await getCheckpointIds()
            initDoors(map, playerTags, playerCheckpointIds)
            initOnboarding()
       
        } else {
            // redirect unknown user to Town if he arrives in World
            if (map === "world") {
                WA.nav.goToRoom("/@/bedrock-1710774685/onboardingbr/town")
            }
            closeTownDoors()
        }
    }).catch(e => console.error(e));
}).catch(e => console.error(e));

export {};
