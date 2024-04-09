/// <reference types="@workadventure/iframe-api-typings" />

import type { Tag } from "./onboarding/checkpoints";
import { isOnboardingDone } from "./onboarding/checkpoints";
import { openBanner, closeBanner } from "./onboarding/ui";

let isRoofVisible = true
type BuildingName = "hr" | "arcade" | "stadium" | "wikitek" | "streaming" | "cave" | "backstage";
type BuildingAccess = {
    [key in BuildingName]: { access: boolean, blockingTiles: [number, number][] };
};
// Define buildings and their minimal access restrictions.
let buildings: BuildingAccess = {
    hr: { access: true, blockingTiles: [[80, 74], [81, 74], [82, 74], [83, 74]] },
    arcade: { access: false, blockingTiles: [[16, 116], [17, 116], [18, 116], [19, 116]] },
    stadium: { access: false, blockingTiles: [[18, 77], [19, 77], [20, 77]] },
    wikitek: { access: false, blockingTiles: [[77, 110], [78, 110], [79, 110], [80, 110], [81, 110], [82, 110]] },
    streaming: { access: false, blockingTiles: [[69, 40], [70, 40], [71, 40], [72, 40]] },
    cave: { access: false, blockingTiles: [[49, 11], [50, 11]] },
    backstage: { access: false, blockingTiles: [[29, 49], [30, 49], [29, 51], [30, 51]] },
};

export function initDoors(map: string, playerTags: Tag[], playerCheckpointIds: string[]) {
    // Apply access restrictions based on player tags and checkpoint.
    if (playerTags.includes("guest")) {
        // Guests can only access hr and arcade.
        Object.keys(buildings).forEach(building => {
            buildings[building as BuildingName].access = building === "hr" || building === "arcade";
        });
    } else if (playerTags.some(tag => ["fr", "pt", "ext", "alt"].includes(tag))) {
        // Access for newbies before and after checkpoint "32" is passed (onboarding is done).
        const hasAccessToAll = isOnboardingDone(playerCheckpointIds)
        buildings.stadium.access = true;
        buildings.cave.access = true;
        buildings.hr.access = true;
        buildings.arcade.access = hasAccessToAll;
        buildings.streaming.access = hasAccessToAll;
        buildings.wikitek.access = hasAccessToAll;
        buildings.backstage.access = hasAccessToAll;
    } else if (playerTags.some(tag => ["admin", "br", "hr"].includes(tag))) {
        // br and hr tags have access to all buildings by default
        Object.keys(buildings).forEach(building => {
            buildings[building as BuildingName].access = true;
        });
    }

    if (map === "town") {
        listenDoor('hr')
        listenDoor('arcade')
        listenDoor('stadium')
        listenDoor('wikitek')
        listenDoor('streaming')
        listenDoor('cave')
        listenDoor('backstage')
    } else if (map === "world") {
        listenDoor('cave')
    }
}

export function closeAllDoors() {
    Object.keys(buildings).forEach(building => {
        buildings[building as BuildingName].access = false;
        lockDoor(building as BuildingName)
    });
}

function listenDoor(building: BuildingName) {
    if (buildings[building as BuildingName].access) {
        WA.room.area.onEnter(`${building}Door`).subscribe(() => {
            unlockDoor(building)
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
        lockDoor(building)
        // Display a message saying that access is denied.
        WA.room.area.onEnter(`${building}Door`).subscribe(() => {
            openBanner("You are not qualified to enter here.")
        })
        WA.room.area.onLeave(`${building}Door`).subscribe(() => {
            closeBanner()
        })
    }
}

function lockDoor(building: BuildingName) {
    const buildingData = buildings[building];

    const tiles = buildingData.blockingTiles.map(([xCoord, yCoord]) => ({
        x: xCoord,
        y: yCoord,
        tile: "collision",
        layer: "collisions"
    }));

    WA.room.setTiles(tiles);
}

function unlockDoor(building: BuildingName) {
    const buildingData = buildings[building];

    const tiles = buildingData.blockingTiles.map(([xCoord, yCoord]) => ({
        x: xCoord,
        y: yCoord,
        tile: null,
        layer: "collisions"
    }));

    WA.room.setTiles(tiles);
}