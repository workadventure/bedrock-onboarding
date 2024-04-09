/// <reference types="@workadventure/iframe-api-typings" />

let isRoofVisible = false

export async function initWorld() {
    console.log('World script started successfully');
    const roofArea = await WA.room.area.get("roof");

    WA.room.area.onEnter('to-tour-rooftop').subscribe(() => {
        // Move camera
        //WA.camera.set(roofArea.x, roofArea.y, 1000, 1000, true, true, 20000);
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

        // Teleport player after 10 seconds
        setTimeout(() => {
            WA.nav.goToRoom("#roof")
        }, 10000)
    })

    // Floors system
    const floors = ['ext', '0', '1', '2', '3', '4', 'roof'];

    generateTourFloorsTransition(floors);

    listenDoor('cave')
}

function generateTourFloorsTransition(arr: string[]) {
    // Forward iteration
    for (let i = 0; i < arr.length - 1; i++) {
        const fromFloor = arr[i]
        const toFloor = arr[i + 1]

        listenFloorTransition(fromFloor, toFloor)
    }

    // Backward iteration
    for (let i = arr.length - 1; i > 0; i--) {
        const fromFloor = arr[i]
        const toFloor = arr[i - 1]

        listenFloorTransition(fromFloor, toFloor)
    }
}

function listenFloorTransition(from: string, to: string) {
    WA.room.area.onEnter(`${from}-${to}`).subscribe(() => {
        WA.nav.goToRoom(`#from-${from}-${to}`)
        WA.room.hideLayer(`tour/${from}`)
        WA.room.showLayer(`tour/${to}`)
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