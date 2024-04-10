/// <reference types="@workadventure/iframe-api-typings" />

import { type Tag, NewbieTag } from "./onboarding/checkpoints";
import { isOnboardingDone, canEnterCaveWorld, canLeaveCaveWorld, canEnterAirport, employees, everyoneButGuests, employeesAndFrenchNewbies } from "./onboarding/checkpoints";
import { openErrorBanner, closeBanner, DOOR_LOCKED } from "./onboarding/ui";

let isRoofVisible = true

/*
********************************************* TOWN *********************************************
*/
type TownBuildingName = "hr" | "arcade" | "stadium" | "wikitek" | "streaming" | "cave" | "backstage";
type TownBuildingAccess = {
    [key in TownBuildingName]: { access: boolean, blockingTiles: [number, number][] };
};
// Define buildings and their minimal access restrictions.
let townBuildings: TownBuildingAccess = {
    hr: { access: true, blockingTiles: [[80, 74], [81, 74], [82, 74], [83, 74]] },
    arcade: { access: false, blockingTiles: [[16, 116], [17, 116], [18, 116], [19, 116]] },
    stadium: { access: false, blockingTiles: [[18, 77], [19, 77], [20, 77]] },
    wikitek: { access: false, blockingTiles: [[77, 110], [78, 110], [79, 110], [80, 110], [81, 110], [82, 110]] },
    streaming: { access: false, blockingTiles: [[69, 40], [70, 40], [71, 40], [72, 40]] },
    cave: { access: false, blockingTiles: [[49, 11], [50, 11]] },
    backstage: { access: false, blockingTiles: [[29, 49], [30, 49], [29, 51], [30, 51]] },
};

type TownCaveDoorAccess = {
    [key in NewbieTag]: { access: boolean, leftWall: [number, number][], rightWall: [number, number][], pillar: [number, number][] };
};
let townCaveProfileDoors: TownCaveDoorAccess = {
    alt: { access: false, leftWall: [[41, 4], [41, 5]], rightWall: [[44, 4], [44, 5]], pillar: [[42, 5], [43, 5], [42, 6], [43, 6]] },
    fr: { access: false, leftWall: [[45, 2], [45, 3]], rightWall: [[48, 2], [48, 3]], pillar: [[46, 3], [47, 3], [46, 4], [47, 4]] },
    ext:  { access: false, leftWall: [[50, 2], [50, 3]], rightWall: [[53, 2], [53, 3]], pillar: [[51, 3], [52, 3], [51, 4], [52, 4]] },
    pt:  { access: false, leftWall: [[54, 4], [54, 5]], rightWall: [[57, 4], [57, 5]], pillar: [[55, 5], [56, 5], [55, 6], [56, 6]] },
}

export function initDoors(map: string, playerTags: Tag[], playerCheckpointIds: string[]) {
    if (map === "town") {
        initTownDoors(playerTags, playerCheckpointIds)
    } else if (map === "world") {
        initWorldDoors(playerCheckpointIds)
    }
}

export function closeTownDoors() {
    Object.keys(townBuildings).forEach(building => {
        townBuildings[building as TownBuildingName].access = false;
        lockTownBuildingDoor(building as TownBuildingName)
    });
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
            townBuildings.backstage.access = hasAccessToAll;
        }

        if (canEnterCaveWorld(playerCheckpointIds)) {
            townCaveProfileDoors.alt.access = playerTags.includes("alt");
            townCaveProfileDoors.fr.access = playerTags.some(tag => employeesAndFrenchNewbies.includes(tag))
            townCaveProfileDoors.ext.access = playerTags.includes("ext");
            townCaveProfileDoors.pt.access = playerTags.includes("pt");
        }
    }

    listenTownDoor('hr')
    listenTownDoor('arcade')
    listenTownDoor('stadium')
    listenTownDoor('wikitek')
    listenTownDoor('streaming')
    listenTownDoor('cave')
    listenTownDoor('backstage')

    initTownCaveDoors()
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

function lockTownBuildingDoor(building: TownBuildingName) {
    const buildingData = townBuildings[building];

    const tiles = buildingData.blockingTiles.map(([xCoord, yCoord]) => ({
        x: xCoord,
        y: yCoord,
        tile: "collision",
        layer: "collisions"
    }));

    WA.room.setTiles(tiles);
}

function unlockTownBuildingDoor(building: TownBuildingName) {
    const buildingData = townBuildings[building];

    const tiles = buildingData.blockingTiles.map(([xCoord, yCoord]) => ({
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

    const pillarTiles = doorData.pillar.map(([xCoord, yCoord], index) => ({
        x: xCoord,
        y: yCoord,
        tile: `no-pillar-${index+1}`,
        layer: "walls/walls1"
    }));
    const leftWallTiles = doorData.leftWall.map(([xCoord, yCoord], index) => ({
        x: xCoord,
        y: yCoord,
        tile: `cave-door-wall-open-${index + 1}`,
        layer: "walls/walls1"
    }));
    const rightWallTiles = doorData.rightWall.map(([xCoord, yCoord], index) => ({
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
    cave: { access: false, blockingTiles: [[29, 182]] },
    airport: { access: false, blockingTiles: [[51, 22], [52, 22], [53, 22]] },
};

function initWorldDoors(playerCheckpointIds: string[]) {
    isRoofVisible = false;

    // Apply access restrictions based on player checkpoint
    worldBuildings.cave.access = canLeaveCaveWorld(playerCheckpointIds);
    worldBuildings.airport.access = canEnterAirport(playerCheckpointIds);

    listenWorldDoor('cave')
    listenWorldDoor('airport')
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

    const tiles = buildingData.blockingTiles.map(([xCoord, yCoord]) => ({
        x: xCoord,
        y: yCoord,
        tile: "collision",
        layer: "collisions"
    }));

    WA.room.setTiles(tiles);
}

function unlockWorldBuildingDoor(building: WorldBuildingName) {
    const buildingData = worldBuildings[building];

    const tiles = buildingData.blockingTiles.map(([xCoord, yCoord]) => ({
        x: xCoord,
        y: yCoord,
        tile: null,
        layer: "collisions"
    }));

    WA.room.setTiles(tiles);
}