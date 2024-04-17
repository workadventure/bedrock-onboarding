/// <reference types="@workadventure/iframe-api-typings" />

import { employees } from "../Data/Tags";
import { brTourFloors } from "../Data/Maps";
import { canEnterCaveWorld } from "../Helpers/Checkpoints";
import { getTilesByRectangleCorners } from "../Helpers/Tiles";
import { pause } from "../Helpers/Utils";
import { displayHelicopterGIF, removeHelicopterGIF } from "../Services/UIManager";
import type { Tag } from "../Type/Tags";
import type { BrTourFloor } from "../Type/Maps";
import { placeTileBrTourFloor, removeTileBrTourFloor } from "../Services/TilesManager";

let isRoofVisible = false

export async function initWorld(playerTags: Tag[], playerCheckpointIds: string[]) {
    console.log('World script started successfully');

    if (!canEnterCaveWorld(playerCheckpointIds) && !playerTags.some(tag => employees.includes(tag))) {
        console.log("Player can't access this room yet.")
        //WA.nav.goToRoom("/@/bedrock-1710774685/onboardingbr/town")
    }

    generateTourFloorsTransition();

    listenDoor('cave')
}

function generateTourFloorsTransition() {
    // Forward iteration
    for (let i = 0; i < brTourFloors.length - 1; i++) {
        const fromFloor = brTourFloors[i]
        const toFloor = brTourFloors[i + 1]

        listenFloorTransition(fromFloor, toFloor)
    }

    // Backward iteration
    for (let i = brTourFloors.length - 1; i > 0; i--) {
        const fromFloor = brTourFloors[i]
        const toFloor = brTourFloors[i - 1]

        listenFloorTransition(fromFloor, toFloor)
    }
}

function listenFloorTransition(from: BrTourFloor, to: BrTourFloor) {
    WA.room.area.onEnter(`${from}-${to}`).subscribe(() => {
        WA.nav.goToRoom(`#from-${from}-${to}`)
        WA.room.hideLayer(`tour/${from}`)
        placeTileBrTourFloor(from)
        WA.room.showLayer(`tour/${to}`)
        removeTileBrTourFloor(to)
    })
}

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

export async function travelFromAirportToRooftop() {
    const cameraDuration = 20 * 1000

    console.log("disablePlayerControls")
    WA.controls.disablePlayerControls()
    // FIXME: Remove the pauses when the API bug will be fixed
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
    WA.player.teleport(50 * 32, 180 * 32);
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
    removeHelicopterGIF()
    await pause(100)

    // Teleport the player onto the rooftop
    console.log("player.teleport")
    WA.player.teleport(27 * 32, 116 * 32);
    await pause(100)

    console.log("restorePlayerControls")
    WA.controls.restorePlayerControls()
    await pause(100)

    WA.camera.followPlayer(true)
}

function removeHelicopterTiles() {
    const tilesCoordinates = getTilesByRectangleCorners([34, 10], [40, 14])
    const tilesFurniture = tilesCoordinates.map(([xCoord, yCoord]) => ({
        x: xCoord,
        y: yCoord,
        tile: null,
        layer: "furniture/furniture1"
    }));
    const tilesAbove = tilesCoordinates.map(([xCoord, yCoord]) => ({
        x: xCoord,
        y: yCoord,
        tile: null,
        layer: "above/above1"
    }));

    WA.room.setTiles([...tilesFurniture, ...tilesAbove]);
}

function placeRooftopHelicopter() {
    console.log("placeRooftopHelicopter()")
    const tilesCoordinates = getTilesByRectangleCorners([26, 114],  [32, 118])
    const tiles = tilesCoordinates.map(([xCoord, yCoord], index) => ({
        x: xCoord,
        y: yCoord,
        tile: `helicopter-landed-${index+1}`,
        layer: "above/above1"
    }));

    WA.room.setTiles(tiles);
}

function moveCameraToRooftop(xCoord: number, yCoord: number, cameraDuration: number) {
    console.log("moveCameraToRooftop()")

    // Move camera frop airport to rooftop during 20 secondes
    // TODO: Use that line instead when the Scripting API will be updated in production
    //WA.camera.set(area.x, area.y, 1000, 1000, false, true, 20000);
    window.parent.postMessage(
        {
            type: "cameraSet",
            data: {
                x: xCoord,
                y: yCoord,
                width: 1000,
                height: 1000,
                lock: true,
                smooth: true,
                duration: cameraDuration
            },
        },
        "*"
    )
}