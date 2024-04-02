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

    WA.room.area.onEnter(`roof-4`).subscribe(() => {
        WA.nav.goToRoom("#from-roof-4")
        WA.room.hideLayer(`tour/roof`)
        WA.room.showLayer(`tour/4`)
    })
    WA.room.area.onEnter(`4-roof`).subscribe(() => {
        WA.nav.goToRoom("#from-4-roof")
        WA.room.hideLayer(`tour/4`)
        WA.room.showLayer(`tour/roof`)
    })

    WA.room.area.onEnter(`4-3`).subscribe(() => {
        WA.nav.goToRoom("#from-4-3")
        WA.room.hideLayer(`tour/4`)
        WA.room.showLayer(`tour/3`)
    })
    WA.room.area.onEnter(`3-4`).subscribe(() => {
        WA.nav.goToRoom("#from-3-4")
        WA.room.hideLayer(`tour/3`)
        WA.room.showLayer(`tour/4`)
    })
    WA.room.area.onEnter(`3-2`).subscribe(() => {
        WA.nav.goToRoom("#from-3-2")
        WA.room.hideLayer(`tour/3`)
        WA.room.showLayer(`tour/2`)
    })
    WA.room.area.onEnter(`2-3`).subscribe(() => {
        WA.nav.goToRoom("#from-2-3")
        WA.room.hideLayer(`tour/2`)
        WA.room.showLayer(`tour/3`)
    })
    WA.room.area.onEnter(`2-1`).subscribe(() => {
        WA.nav.goToRoom("#from-2-1")
        WA.room.hideLayer(`tour/2`)
        WA.room.showLayer(`tour/1`)
    })
    WA.room.area.onEnter(`1-2`).subscribe(() => {
        WA.nav.goToRoom("#from-1-2")
        WA.room.hideLayer(`tour/1`)
        WA.room.showLayer(`tour/2`)
    })
    WA.room.area.onEnter(`1-0`).subscribe(() => {
        WA.nav.goToRoom("#from-1-0")
        WA.room.hideLayer(`tour/1`)
        WA.room.showLayer(`tour/0`)
    })
    WA.room.area.onEnter(`0-1`).subscribe(() => {
        WA.nav.goToRoom("#from-0-1")
        WA.room.hideLayer(`tour/0`)
        WA.room.showLayer(`tour/1`)
    })

    WA.room.area.onEnter(`0-ext`).subscribe(() => {
        WA.nav.goToRoom("#from-0-ext")
        WA.room.hideLayer(`tour/0`)
        WA.room.showLayer(`tour/ext`)
    })
    WA.room.area.onEnter(`ext-0`).subscribe(() => {
        WA.nav.goToRoom("#from-ext-0")
        WA.room.hideLayer(`tour/ext`)
        WA.room.showLayer(`tour/0`)
    })
        
    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

export {};
