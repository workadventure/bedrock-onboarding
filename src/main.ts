/// <reference types="@workadventure/iframe-api-typings" />
console.log('Main script started successfully');

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

import { initTown } from "./town";
import { initWorld } from "./world";
import { initOnboarding } from "./onboarding/index";
import { displayChecklistButton } from "./onboarding/ui";
import { initDoors } from "./doors";
import { getCheckpointIds, type Tag } from "./onboarding/checkpoints";

WA.onInit().then(() => {
    console.log('Scripting API ready');

    const playerTags = WA.player.tags as Tag[]
    console.log('Player tags: ', playerTags)

    if (!playerTags.includes("guest")) {
        // @ts-ignore
        WA.controls.disableInviteButton();
        displayChecklistButton()
    }

    bootstrapExtra().then(async () => {
        console.log('Scripting API Extra ready');

        const map = await WA.state.map as string
        // Load specific map scripts
        if (map === "town") {
            initTown()
        } else if (map === "world") {
            initWorld()
        }
        
        const playerCheckpointIds = await getCheckpointIds()
        initDoors(map, playerTags, playerCheckpointIds)
        initOnboarding(map, playerTags)
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

export {};
