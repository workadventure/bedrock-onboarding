/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

// Waiting for the API to be ready
WA.onInit().then(async () => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    const roofArea = await WA.room.area.get("roof");

    WA.room.area.onEnter('to-tour-rooftop').subscribe(() => {
        WA.nav.goToRoom("#roof")
        WA.camera.set(roofArea.x, roofArea.y, 1000, 1000, true, true);
    })
        
    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

export {};
