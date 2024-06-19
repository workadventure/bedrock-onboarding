/// <reference types="@workadventure/iframe-api-typings" />

import { brTowerFloors, townMapUrl } from "../Constants/Maps";
import { checkpointIdsStore } from "../State/Properties/CheckpointIdsStore";
import { playerTagsStore } from "../State/Properties/PlayerTagsStore";
import { pause } from "../Utils/Utils";
import { displayHelicopterGIF, removeHelicopterGIF } from "../Services/UIManager";
import type { BrTowerFloor } from "../Types/Maps";
import { placeRooftopHelicopter, placeTileBrTowerFloor, removeHelicopterTiles, removeTileBrTowerFloor } from "../Services/TilesManager";

export function initWorld() {
    console.log('World script started successfully');

    if (!checkpointIdsStore.canEnterCaveWorld() && !playerTagsStore.isEmployee) {
        console.log("Player can't access this room yet.")
        WA.nav.goToRoom(townMapUrl);
        return;
    }

    generateTowerFloorsTransition();
}

function generateTowerFloorsTransition() {
    // Forward iteration
    for (let i = 0; i < brTowerFloors.length - 1; i++) {
        const fromFloor = brTowerFloors[i]
        const toFloor = brTowerFloors[i + 1]

        listenFloorTransition(fromFloor, toFloor)
    }

    // Backward iteration
    for (let i = brTowerFloors.length - 1; i > 0; i--) {
        const fromFloor = brTowerFloors[i]
        const toFloor = brTowerFloors[i - 1]

        listenFloorTransition(fromFloor, toFloor)
    }
}

function listenFloorTransition(from: BrTowerFloor, to: BrTowerFloor) {
    WA.room.area.onEnter(`${from}-${to}`).subscribe(() => {
        console.log("from",from)
        console.log("to",to)
        WA.nav.goToRoom(`#from-${from}-${to}`)
        WA.room.hideLayer(`tower/${from}`)
        placeTileBrTowerFloor(from)
        WA.room.showLayer(`tower/${to}`)
        removeTileBrTowerFloor(to)
    })
}

export async function travelFromAirportToRooftop() {
    const cameraDuration = 20 * 1000

    console.log("disablePlayerControls")
    WA.controls.disablePlayerControls()
    // We must wait a little bit because its too fast for the PAI
    await pause(100)

    // Zoom out above the helicopter tiles
    console.log("camera.set")
    WA.camera.set(39 * 32, 13 * 32, 1000, 1000, true, true);
    await pause(100)

    console.log("displayHelicopterGIF")
    await displayHelicopterGIF()
    await pause(100)

    // We need to remove the woka from the current viewport
    // But we can't teleport him at the rooftop yet, so we teleport him at the map entry
    console.log("player.teleport")
    await WA.player.teleport(50 * 32, 180 * 32);
    await pause(100)

    console.log("removeAirportHelicopter")
    removeHelicopterTiles()
    await pause(100)
   
    console.log("moveCameraToRooftop")
    moveCameraToRooftop(32 * 32, 118 * 32, cameraDuration)
    await pause(cameraDuration)
    console.log("LANDED")

    console.log("placeRooftopHelicopter")
    placeRooftopHelicopter()
    await pause(100)

    console.log("removeHelicopterGIF")
    await removeHelicopterGIF()
    await pause(100)

    // Teleport the player onto the rooftop
    console.log("player.teleport")
    await WA.player.teleport(27 * 32, 116 * 32);
    await pause(100)

    console.log("restorePlayerControls")
    WA.controls.restorePlayerControls()
    await pause(100)

    WA.camera.followPlayer(true)
}

function moveCameraToRooftop(xCoord: number, yCoord: number, cameraDuration: number) {
    console.log("moveCameraToRooftop()")

    // Move camera frop airport to rooftop during 20 secondes
    WA.camera.set(xCoord, yCoord, 1000, 1000, true, true, cameraDuration);
}