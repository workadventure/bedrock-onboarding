/// <reference types="@workadventure/iframe-api-typings" />

import { ActionMessage, TileDescriptor } from "@workadventure/iframe-api-typings";
import { type Tag, NewbieTag, canAccessAchievements, canAccessValues, canAccessLegal, canAccessBridge, canAccessFrance, canAccessHungary, canAccessBelgium, canAccessNetherlands } from "./onboarding/checkpoints";
import { isOnboardingDone, canEnterCaveWorld, canLeaveCaveWorld, canEnterAirport, employees, everyoneButGuests, employeesAndFrenchNewbies } from "./onboarding/checkpoints";
import { openErrorBanner, closeBanner, DOOR_LOCKED } from "./onboarding/ui";

let isRoofVisible = true

export function initDoors(map: string, playerTags: Tag[], playerCheckpointIds: string[]) {
    if (map === "town") {
        initTownDoors(playerTags, playerCheckpointIds)
    } else if (map === "world") {
        initWorldDoors(playerCheckpointIds)
    }
}
/*
********************************************* TOWN *********************************************
*/
type TownBuildingName = "hr" | "arcade" | "stadium" | "wikitek" | "streaming" | "cave" | "backstage";
type TownBuildingAccess = {
    [key in TownBuildingName]: { access: boolean, blockingTiles: [number, number][] };
};
// Define buildings and their minimal access restrictions.
let townBuildings: TownBuildingAccess = {
    hr: { access: true, blockingTiles: [[80, 74], [83, 74]] },
    arcade: { access: false, blockingTiles: [[16, 116], [19, 116]] },
    stadium: { access: false, blockingTiles: [[18, 77], [20, 77]] },
    wikitek: { access: false, blockingTiles: [[77, 110], [82, 110]] },
    streaming: { access: false, blockingTiles: [[69, 40], [72, 40]] },
    cave: { access: false, blockingTiles: [[49, 11], [50, 11]] },
    backstage: { access: false, blockingTiles: [[29, 49], [30, 51]] },
};

type TownCaveDoorAccess = {
    [key in NewbieTag]: { access: boolean, leftWall: [number, number][], rightWall: [number, number][], pillar: [number, number][] };
};
let townCaveProfileDoors: TownCaveDoorAccess = {
    alt: { access: false, leftWall: [[41, 4], [41, 5]], rightWall: [[44, 4], [44, 5]], pillar: [[42, 5], [43, 6]] },
    fr: { access: false, leftWall: [[45, 2], [45, 3]], rightWall: [[48, 2], [48, 3]], pillar: [[46, 3], [47, 4]] },
    ext:  { access: false, leftWall: [[50, 2], [50, 3]], rightWall: [[53, 2], [53, 3]], pillar: [[51, 3], [52, 4]] },
    pt:  { access: false, leftWall: [[54, 4], [54, 5]], rightWall: [[57, 4], [57, 5]], pillar: [[55, 5], [56, 6]] },
}

type HrMeetingDoorName = "hrMeetingDoor1" | "hrMeetingDoor2" | "hrMeetingDoor3" | "hrMeetingDoor4";
type HRMeetingDoorAccess = {
    [key in HrMeetingDoorName]: { access: boolean, tilesNamePattern: string, tilesCoordinates: [number, number][] };
};
let hrMeetingDoors: HRMeetingDoorAccess = {
    "hrMeetingDoor1": { access: false, tilesNamePattern: "hr-meeting-door", tilesCoordinates: [[71, 62], [72, 63]] },
    "hrMeetingDoor2": { access: false, tilesNamePattern: "hr-meeting-door", tilesCoordinates: [[76, 62], [77, 63]] },
    "hrMeetingDoor3": { access: false, tilesNamePattern: "hr-meeting-door", tilesCoordinates: [[88, 62], [89, 63]] },
    "hrMeetingDoor4": { access: false, tilesNamePattern: "hr-meeting-door", tilesCoordinates: [[93, 62], [94, 63]] },
}

function initTownDoors(playerTags: Tag[], playerCheckpointIds: string[]) {
    // Apply access restrictions based on player tags and checkpoint
    if (playerTags.includes("guest")) {
        // Guests can only access hr and arcade.
        Object.keys(townBuildings).forEach(building => {
            townBuildings[building as TownBuildingName].access = building === "hr" || building === "arcade";
        });
    } else if (playerTags.some(tag => everyoneButGuests.includes(tag))) {
        const hasAccessToAll = isOnboardingDone(playerCheckpointIds)
        townBuildings.stadium.access = true;
        townBuildings.cave.access = true;
        townBuildings.hr.access = true;
        townBuildings.arcade.access = hasAccessToAll;
        townBuildings.streaming.access = hasAccessToAll;
        townBuildings.wikitek.access = hasAccessToAll;
        townBuildings.backstage.access = hasAccessToAll;

        if (playerTags.some(tag => employees.includes(tag))) {
            Object.keys(townBuildings).forEach(building => {
                townBuildings[building as TownBuildingName].access = true;
            });
        }

        if (canEnterCaveWorld(playerCheckpointIds)) {
            townCaveProfileDoors.alt.access = playerTags.includes("alt");
            townCaveProfileDoors.fr.access = playerTags.some(tag => employeesAndFrenchNewbies.includes(tag))
            townCaveProfileDoors.ext.access = playerTags.includes("ext");
            townCaveProfileDoors.pt.access = playerTags.includes("pt");
        }
    }

    for (const key in townBuildings) {
        listenTownDoor(key as TownBuildingName)
    }

    for (const key in hrMeetingDoors) {
        listenHrDoors(key as HrMeetingDoorName, playerTags);
    }

    initTownCaveDoors()

    console.log("townBuildings",townBuildings)
    console.log("townCaveProfileDoors",townCaveProfileDoors)
    console.log("hrMeetingDoors",hrMeetingDoors)
}

function listenTownDoor(building: TownBuildingName) {
    if (townBuildings[building as TownBuildingName].access) {
        WA.room.area.onEnter(`${building}Door`).subscribe(() => {
            unlockTownBuildingDoor(building)
            if (isRoofVisible === true) {
                isRoofVisible = false
                WA.room.hideLayer(`roofs/${building}1`)
                WA.room.hideLayer(`roofs/${building}2`)
            } else {
                isRoofVisible = true
                WA.room.showLayer(`roofs/${building}1`)
                WA.room.showLayer(`roofs/${building}2`)
            }
        })
    } else {
        lockTownBuildingDoor(building)
        // Display a message saying that access is denied.
        WA.room.area.onEnter(`${building}Door`).subscribe(() => {
            openErrorBanner(DOOR_LOCKED)
        })
        WA.room.area.onLeave(`${building}Door`).subscribe(() => {
            closeBanner()
        })
    }
}

function listenHrDoors(meetingDoor: HrMeetingDoorName, playerTags: Tag[]) {
    let actionMessage: ActionMessage|null

    // initialize the default door state
    toggleHrMeetingDoor(meetingDoor)

    // only HRs or admins can open/close the doors
    if (playerTags.some(tag => ["admin", "hr"].includes(tag))) {
        WA.room.area.onEnter(meetingDoor).subscribe(() => {
            // display an action message to open or close
            // that will depend on the current door state
            actionMessage = WA.ui.displayActionMessage({
                message: `Press SPACE to ${!hrMeetingDoors[meetingDoor].access ? 'open' : 'close'} the door`,
                callback: () => {
                    // send the event
                    WA.event.broadcast(meetingDoor, !hrMeetingDoors[meetingDoor].access);
                }
            })
        })

        // remove the action message after leaving the area
        WA.room.area.onLeave(meetingDoor).subscribe(() => {
            actionMessage?.remove()
            actionMessage = null
        })
    }

    // listen to the event sent by HRs
    WA.event.on(meetingDoor).subscribe((event) => {
        hrMeetingDoors[meetingDoor].access = event.data as boolean
        toggleHrMeetingDoor(meetingDoor)
    });
}

function toggleHrMeetingDoor(meetingDoor: HrMeetingDoorName) {
    const meetingDoorData = hrMeetingDoors[meetingDoor];
    const tilesCoordinates = getTilesByRectangleCorners(meetingDoorData.tilesCoordinates[0], meetingDoorData.tilesCoordinates[1])

    // Find the tile name, like: hr-meeting-door-closed
    // exact name with its number will be found down here, like: hr-meeting-door-closed-1
    const tileName = `${meetingDoorData.tilesNamePattern}-${hrMeetingDoors[meetingDoor].access ? 'open' : 'closed'}`
    const tiles = tilesCoordinates.map(([xCoord, yCoord], index) => ({
        x: xCoord,
        y: yCoord,
        tile: `${tileName}-${index+1}`,
        layer: "furniture/furniture2"
    }));

    WA.room.setTiles(tiles);
}

function lockTownBuildingDoor(building: TownBuildingName) {
    const buildingData = townBuildings[building];
    const tilesCoordinates = getTilesByRectangleCorners(buildingData.blockingTiles[0], buildingData.blockingTiles[1])
    const tiles = tilesCoordinates.map(([xCoord, yCoord]) => ({
        x: xCoord,
        y: yCoord,
        tile: "collision",
        layer: "collisions"
    }));

    WA.room.setTiles(tiles);
}

function unlockTownBuildingDoor(building: TownBuildingName) {
    const buildingData = townBuildings[building];
    const tilesCoordinates = getTilesByRectangleCorners(buildingData.blockingTiles[0], buildingData.blockingTiles[1])
    const tiles = tilesCoordinates.map(([xCoord, yCoord]) => ({
        x: xCoord,
        y: yCoord,
        tile: null,
        layer: "collisions"
    }));

    WA.room.setTiles(tiles);
}

function initTownCaveDoors() {
    Object.keys(townCaveProfileDoors).forEach(door => {
        if (townCaveProfileDoors[door as NewbieTag].access === true) {
            unlockTownCaveDoor(door as NewbieTag)
        }
    });
}

export function unlockTownCaveDoor(door: NewbieTag) {
    const doorData = townCaveProfileDoors[door];

    const pillarTilesCoordinates = getTilesByRectangleCorners(doorData.pillar[0], doorData.pillar[1])
    const leftWallTilesCoordinates = getTilesByRectangleCorners(doorData.leftWall[0], doorData.leftWall[1])
    const rightWallTilesCoordinates = getTilesByRectangleCorners(doorData.rightWall[0], doorData.rightWall[1])


    const pillarTiles = pillarTilesCoordinates.map(([xCoord, yCoord], index) => ({
        x: xCoord,
        y: yCoord,
        tile: `no-pillar-${index+1}`,
        layer: "walls/walls1"
    }));
    const leftWallTiles = leftWallTilesCoordinates.map(([xCoord, yCoord], index) => ({
        x: xCoord,
        y: yCoord,
        tile: `cave-door-wall-open-${index + 1}`,
        layer: "walls/walls1"
    }));
    const rightWallTiles = rightWallTilesCoordinates.map(([xCoord, yCoord], index) => ({
        x: xCoord,
        y: yCoord,
        tile: `cave-door-wall-open-${index + 1}`,
        layer: "walls/walls1"
    }));
    
    // Combine pillar, left wall, and right wall tiles into one array in order to open the door
    const combinedTiles = [...pillarTiles, ...leftWallTiles, ...rightWallTiles];
    WA.room.setTiles(combinedTiles);
}

export function getCaveDoorToOpen(playerTags: Tag[]): NewbieTag|null {
    // get the cave door to open depending on the player tags (for external use)
    let door: NewbieTag | null = null
    
    if (playerTags.some(tag => employees.includes(tag))) {
        door = "fr"
    } else if (playerTags.includes("alt")) {
        door = "alt"
    } else if (playerTags.includes("ext")) {
        door = "ext"
    } else if (playerTags.includes("pt")) {
        door = "pt"
    }

    return door
}

/*
********************************************* WORLD *********************************************
*/

type WorldBuildingName = "cave" | "airport";
type WorldBuildingAccess = {
    [key in WorldBuildingName]: { access: boolean, blockingTiles: [number, number][] };
};
// Define buildings and their minimal access restrictions.
let worldBuildings: WorldBuildingAccess = {
    cave: { access: false, blockingTiles: [[29, 181], [29, 182]] },
    airport: { access: false, blockingTiles: [[51, 22],[53, 22]] },
};

type WorldBarrierName = "achievements" | "values" | "legal" | "bridge" | "france" | "hungary" | "belgium" | "netherlands";
type WorldBarrierAccess = {
    [key in WorldBarrierName]: { access: boolean, blockingTiles: [number, number][] };
};
// Define buildings and their minimal access restrictions.
let worldBarriers: WorldBarrierAccess = {
    achievements: { access: true, blockingTiles: [[84, 168], [87, 168]] },
    values: { access: true, blockingTiles: [[61, 159], [61, 153]] },
    legal: { access: true, blockingTiles: [[37, 107], [37, 111]] },
    bridge: { access: true, blockingTiles: [[18, 83], [22, 83]] },
    france: { access: true, blockingTiles: [[19, 67], [21, 67]] },
    hungary: { access: true, blockingTiles: [[72, 48], [72, 52]] },
    belgium: { access: true, blockingTiles: [[102, 23], [106, 23]] },
    netherlands: { access: true, blockingTiles: [[70, 30], [70, 34]] },
};


type AirportGateAccess = { access: boolean, turnstile: [number, number][], lightsY: [number, number][], lightsX: [number, number][] };
let airportGate: AirportGateAccess = 
    { access: false, turnstile: [[52, 11], [52, 12]], lightsY: [[52, 6], [52, 10]], lightsX: [[48, 5], [52, 5]] }

function initWorldDoors(playerCheckpointIds: string[]) {
    isRoofVisible = false;

    // Apply access restrictions based on player checkpoint
    worldBuildings.cave.access = canLeaveCaveWorld(playerCheckpointIds);
    worldBuildings.airport.access = canEnterAirport(playerCheckpointIds);

    worldBarriers.achievements.access = canAccessAchievements(playerCheckpointIds);
    worldBarriers.values.access = canAccessValues(playerCheckpointIds);
    worldBarriers.legal.access = canAccessLegal(playerCheckpointIds);
    worldBarriers.bridge.access = canAccessBridge(playerCheckpointIds);
    worldBarriers.france.access = canAccessFrance(playerCheckpointIds);
    worldBarriers.hungary.access = canAccessHungary(playerCheckpointIds);
    worldBarriers.belgium.access = canAccessBelgium(playerCheckpointIds);
    worldBarriers.netherlands.access = canAccessNetherlands(playerCheckpointIds);

    airportGate.access = canEnterAirport(playerCheckpointIds);

    listenWorldDoor('cave')
    listenWorldDoor('airport')

    unlockWorldBarriers()
    unlockAirportGate()

    console.log("worldBuildings",worldBuildings)
    console.log("worldBarriers",worldBarriers)
    console.log("airportGate",airportGate)
}

function listenWorldDoor(building: WorldBuildingName) {
    if (worldBuildings[building as WorldBuildingName].access) {
        WA.room.area.onEnter(`${building}Door`).subscribe(() => {
            unlockWorldBuildingDoor(building)
            if (isRoofVisible === true) {
                isRoofVisible = false
                WA.room.hideLayer(`roofs/${building}1`)
                WA.room.hideLayer(`roofs/${building}2`)
            } else {
                isRoofVisible = true
                WA.room.showLayer(`roofs/${building}1`)
                WA.room.showLayer(`roofs/${building}2`)
            }
        })
    } else {
        lockWorldBuildingDoor(building)
        // Display a message saying that access is denied.
        WA.room.area.onEnter(`${building}Door`).subscribe(() => {
            openErrorBanner(DOOR_LOCKED)
        })
        WA.room.area.onLeave(`${building}Door`).subscribe(() => {
            closeBanner()
        })
    }
}

function lockWorldBuildingDoor(building: WorldBuildingName) {
    const buildingData = worldBuildings[building];
    const tilesCoordinates = getTilesByRectangleCorners(buildingData.blockingTiles[0], buildingData.blockingTiles[1])
    const tiles = tilesCoordinates.map(([xCoord, yCoord]) => ({
        x: xCoord,
        y: yCoord,
        tile: "collision",
        layer: "collisions"
    }));

    WA.room.setTiles(tiles);
}

export function unlockWorldBuildingDoor(building: WorldBuildingName) {
    const buildingData = worldBuildings[building];
    const tilesCoordinates = getTilesByRectangleCorners(buildingData.blockingTiles[0], buildingData.blockingTiles[1])
    const tiles = tilesCoordinates.map(([xCoord, yCoord]) => ({
        x: xCoord,
        y: yCoord,
        tile: null,
        layer: "collisions"
    }));

    WA.room.setTiles(tiles);
}

function unlockWorldBarriers() {
    let tiles: TileDescriptor[] = [];

    // Iterate over each barrier in the worldBarriers object
    Object.entries(worldBarriers).forEach(([_barrierName, barrierData]) => {
        // Check if the barrier is accessible
        if (barrierData.access) {
            // Iterate over the blocking tiles of the barrier and add them to the tilesToRemove array
            barrierData.blockingTiles.forEach(([xCoord, yCoord]) => {
                tiles.push({
                    x: xCoord,
                    y: yCoord,
                    tile: null,
                    layer: "walls/walls1"
                });
            });
        }
    });

    // Remove the tiles for the accessible barriers
    WA.room.setTiles(tiles);
}

export function unlockWorldBarrier(barrier: WorldBarrierName) {
    const barrierData = worldBarriers[barrier];
    const tilesCoordinates = getTilesByRectangleCorners(barrierData.blockingTiles[0], barrierData.blockingTiles[1])
    const tiles = tilesCoordinates.map(([xCoord, yCoord]) => ({
        x: xCoord,
        y: yCoord,
        tile: null,
        layer: "walls/walls1"
    }));

    WA.room.setTiles(tiles);
}

export function unlockAirportGate() {
    if (airportGate.access) {
        const turnstileTilesCoordinates = getTilesByRectangleCorners(airportGate.turnstile[0], airportGate.turnstile[1])
        const lightsYTilesCoordinates = getTilesByRectangleCorners(airportGate.lightsY[0], airportGate.lightsY[1])
        const lightsXTilesCoordinates = getTilesByRectangleCorners(airportGate.lightsX[0], airportGate.lightsX[1])
    
    
        const turnstileTiles = turnstileTilesCoordinates.map(([xCoord, yCoord], index) => ({
            x: xCoord,
            y: yCoord,
            tile: `airport-turnstile-open-${index+1}`,
            layer: "furniture/furniture3"
        }));
        const lightsYTiles = lightsYTilesCoordinates.map(([xCoord, yCoord], index) => ({
            x: xCoord,
            y: yCoord,
            tile: `floor-light-y-${index + 1}`,
            layer: "furniture/furniture1"
        }));
        const lightsXTiles = lightsXTilesCoordinates.map(([xCoord, yCoord], index) => ({
            x: xCoord,
            y: yCoord,
            tile: `floor-light-x-${index + 1}`,
            layer: "furniture/furniture1"
        }));
        
        // Combine turnstile, vertical and horizontal lights into one array in order to open the gate
        const combinedTiles = [...turnstileTiles, ...lightsYTiles, ...lightsXTiles];
        WA.room.setTiles(combinedTiles);
    }
}

/*
********************************************* Utils *********************************************
*/
// Generates in-between range of tiles coordinates from top-left and bottom-right coordinates
function getTilesByRectangleCorners(topLeft: number[], bottomRight: number[]): number[][] {
    const tiles = [];
    const [topLeftX, topLeftY] = topLeft;
    const [bottomRightX, bottomRightY] = bottomRight;

    // Iterate over the rows first
    for (let y = topLeftY; y <= bottomRightY; y++) {
        // Then iterate over the columns
        for (let x = topLeftX; x <= bottomRightX; x++) {
            // Add the current tile coordinates to the tiles array
            tiles.push([x, y]);
        }
    }
    return tiles;
}