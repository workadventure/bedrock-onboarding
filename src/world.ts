/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

// Waiting for the API to be ready
WA.onInit().then(async () => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    const roofArea = await WA.room.area.get("roof");

    WA.room.area.onEnter('to-tour-rooftop').subscribe(() => {
        // Move camera
        //WA.camera.set(roofArea.x, roofArea.y, 1000, 1000, true, true, 10000);
        window.parent.postMessage(
            {
                type: "cameraSet",
                data: {
                    x: roofArea.x,
                    y: roofArea.y,
                    width: 1000,
                    height: 1000,
                    lock: true,
                    smooth: true,
                    duration: 20000 
                },
            },
            "*"
        )

        // Teleport player
        setTimeout(() => {
            WA.nav.goToRoom("#roof")
        }, 10000)
    })
        
    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

export {};
