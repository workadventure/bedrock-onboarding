/// <reference types="@workadventure/iframe-api-typings" />
console.log('Main script started successfully');

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

import { initTown } from "./town";
import { initWorld } from "./world";
import { initOnboarding } from "./onboarding/index";
import { displayChecklistButton } from "./onboarding/ui";
import { initDoors } from "./doors";
import type { Tag } from "./onboarding/checkpoints";
import { addElement } from './db/actions';

WA.onInit().then(() => {
    console.log('Scripting API ready');

    const playerTags = WA.player.tags as Tag[]
    console.log('Player tags: ', playerTags)

    if (!playerTags.includes("guest")) {
        // @ts-ignore
        WA.controls.disableInviteButton();
        displayChecklistButton()
    }

    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');

        const map = WA.state.loadVariable('map') as string
        // Load specific map scripts
        if (map === "town") {
            initTown()
        } else if (map === "world") {
            initWorld()
        }
        
        const playerCheckpointIds = WA.player.state.checkpoints as string[]
        initDoors(map, playerTags, playerCheckpointIds)
        initOnboarding(map, playerTags, playerCheckpointIds)
        
        const addTodo = (title: string) => {
            const newTodo = { title, done: false };
            addElement('todos', newTodo).then(() => {
                console.log('New to-do added:', title);
                // Optionally, refresh the to-do list on the UI
            }).catch(console.error);
        };
        
        addTodo("coucou")
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

export {};
