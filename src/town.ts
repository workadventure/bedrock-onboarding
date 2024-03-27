/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let isRoofVisible = true

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    listenDoor('arcade')
    listenDoor('wikitek')
    listenDoor('stadium')
    listenDoor('hr')
    listenDoor('streaming')
    listenDoor('cave')

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function listenDoor(room: string) {
    WA.room.area.onEnter(`${room}Door`).subscribe(() => {
        if (isRoofVisible === true) {
            isRoofVisible = false
            WA.room.hideLayer(`roofs/${room}1`)
            WA.room.hideLayer(`roofs/${room}2`)
        } else {
            isRoofVisible = true
            WA.room.showLayer(`roofs/${room}1`)
            WA.room.showLayer(`roofs/${room}2`)
        }
    })
}

export {};
