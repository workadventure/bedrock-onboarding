/// <reference types="@workadventure/iframe-api-typings" />

import { ActionMessage, TileDescriptor } from "@workadventure/iframe-api-typings";

import type { AirportGateAccess, BrTowerFloorAccess, BrTowerFloorName, HRMeetingDoorAccess, HrMeetingDoorName, TownBuildingAccess, TownBuildingName, TownExitName, TownCaveDoorAccess, WorldBarrierAccess, WorldBarrierName, WorldBuildingAccess, WorldBuildingName } from "../Types/Doors";
import type { NewbieTag } from "../Types/Tags";
import type { Map } from "../Types/Maps";
import { getTilesByRectangleCorners } from "../Utils/Tiles";
import { travelFromAirportToRooftop } from "../Maps/World"
import { currentMapStore } from "../State/Properties/CurrentMapStore";
import { playerTagsStore } from "../State/Properties/PlayerTagsStore";
import { checkpointIdsStore } from "../State/Properties/CheckpointIdsStore";
import { mapUrl } from "../Constants/Maps";
import { closeBanner, openErrorBanner } from "./UIManager";

export function initDoors()
{
    if (currentMapStore.isTown())
    {
        initTownDoors()
    } else if (currentMapStore.isWorld())
    {
        initWorldDoors()
    }
}

export async function goToRoom(map: Map, entry?: string)
{
    let roomUrl = mapUrl[map]

    if (entry)
    {
        roomUrl += `#${entry}`
        await playerCameFromDoor(true)
    }

    WA.nav.goToRoom(roomUrl)
}

export async function playerCameFromDoor(value: boolean)
{
    await WA.player.state.saveVariable("playerCameFromDoor", value, {
        public: false,
        persist: true,
        scope: "world",
    });
}

/*
********************************************* TOWN *********************************************
*/
// Define buildings and their minimal access restrictions.
const townBuildings: TownBuildingAccess = {
    hr: { access: true, blockingTiles: [[80, 74], [83, 74]] },
    arcade: { access: false, blockingTiles: [[16, 116], [19, 116]] },
    stadium: { access: false, blockingTiles: [[18, 77], [20, 77]] },
    wikitech: { access: false, blockingTiles: [[77, 110], [82, 110]] },
    streaming: { access: false, blockingTiles: [[71, 40], [75, 40]] },
    cave: { access: false, blockingTiles: [[49, 11], [50, 11]] },
    backstage: { access: false, blockingTiles: [[29, 50], [30, 51]] },
    service: { access: false, blockingTiles: [[10, 39], [12, 41]] },
};

const townCaveProfileDoors: TownCaveDoorAccess = {
    alt: { access: false, leftWall: [[39, 3], [39, 4]], rightWall: [[42, 3], [42, 4]], pillar: [[40, 4], [41, 5]] },
    fr: { access: false, leftWall: [[43, 1], [43, 2]], rightWall: [[46, 1], [46, 2]], pillar: [[44, 2], [45, 3]] },
    de: { access: false, leftWall: [[48, 1], [48, 2]], rightWall: [[51, 1], [51, 2]], pillar: [[49, 2], [50, 3]] },
    pt: { access: false, leftWall: [[53, 1], [53, 2]], rightWall: [[56, 1], [56, 2]], pillar: [[54, 2], [55, 3]] },
    ext: { access: false, leftWall: [[57, 3], [57, 4]], rightWall: [[60, 3], [60, 4]], pillar: [[58, 4], [59, 5]] },
}

const hrMeetingDoors: HRMeetingDoorAccess = {
    "hrMeetingDoor1": { access: false, tilesNamePattern: "hr-meeting-door", tilesCoordinates: [[71, 62], [72, 63]] },
    "hrMeetingDoor2": { access: false, tilesNamePattern: "hr-meeting-door", tilesCoordinates: [[76, 62], [77, 63]] },
    "hrMeetingDoor3": { access: false, tilesNamePattern: "hr-meeting-door", tilesCoordinates: [[88, 62], [89, 63]] },
    "hrMeetingDoor4": { access: false, tilesNamePattern: "hr-meeting-door", tilesCoordinates: [[93, 62], [94, 63]] },
}

const townExits: TownExitName[] = [
    "world-from-alt",
    "world-from-fr",
    "world-from-de",
    "world-from-pt",
    "world-from-ext",
]

function initTownDoors()
{
    // Apply access restrictions based on player tags and checkpoint
    if (playerTagsStore.isGuest())
    {
        // Guests can only access hr and arcade.
        Object.keys(townBuildings).forEach(building =>
        {
            townBuildings[building as TownBuildingName].access = building === "hr" || building === "arcade";
        });
    } else if (playerTagsStore.isOtherThanGuest())
    {
        const isBackstageDone = checkpointIdsStore.isBackstageDone()
        townBuildings.stadium.access = true;
        townBuildings.cave.access = true;
        townBuildings.hr.access = true;
        townBuildings.service.access = checkpointIdsStore.isWorldMapDone();
        townBuildings.arcade.access = isBackstageDone;
        townBuildings.streaming.access = isBackstageDone;
        townBuildings.wikitech.access = isBackstageDone;
        townBuildings.backstage.access = isBackstageDone;

        if (checkpointIdsStore.canEnterCaveWorld())
        {
            townCaveProfileDoors.alt.access = playerTagsStore.hasAltProfile()
            townCaveProfileDoors.fr.access = playerTagsStore.hasFrProfile()
            townCaveProfileDoors.de.access = playerTagsStore.hasDeProfile()
            townCaveProfileDoors.pt.access = playerTagsStore.hasPtProfile()
            townCaveProfileDoors.ext.access = playerTagsStore.hasExtProfile()
        }

        // unlock all doors for employees
        if (playerTagsStore.isEmployee())
        {
            console.log("Open all town buildings")
            Object.keys(townBuildings).forEach(building =>
            {
                townBuildings[building as TownBuildingName].access = true;
            });
            // Also open the FR profile door (otherwise just employees could not pass the cave)
            townCaveProfileDoors.fr.access = true;
        }
    }

    for (const key in townBuildings)
    {
        listenTownDoor(key as TownBuildingName);
    }

    for (const key in hrMeetingDoors)
    {
        initHrDoors(key as HrMeetingDoorName);
        listenHrDoors(key as HrMeetingDoorName);
    }

    initTownCaveDoors()

    for (const key of townExits)
    {
        listenTownExits(key);
    }

    console.log("townBuildings", townBuildings)
    console.log("townCaveProfileDoors", townCaveProfileDoors)
    console.log("hrMeetingDoors", hrMeetingDoors)
}

function listenTownExits(exit: TownExitName)
{
    console.log("listenTownExits()")

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    WA.room.area.onEnter(`to-${exit}`).subscribe(async () =>
    {
        await goToRoom("world", "from-town")
    });
}

function listenTownDoor(building: TownBuildingName)
{
    console.log("listenTownDoor()")

    type StadiumPlayerPosition = "BACK" | "BACKSTAGE" | "AUDITORIUM" | "FRONT"
    let playerPosition: StadiumPlayerPosition

    listenStadiumPlayerPosition("BACK")
    listenStadiumPlayerPosition("BACKSTAGE")
    listenStadiumPlayerPosition("AUDITORIUM")
    listenStadiumPlayerPosition("FRONT")

    function listenStadiumPlayerPosition(position: StadiumPlayerPosition)
    {
        WA.room.area.onEnter(`playerPosition_${position}`).subscribe(() =>
        {
            console.log("onEnter", `${position}`)
            playerPosition = position;
        });
    }

    // Function to handle actions when player enters the door area
    function handleEnter()
    {
        console.log(`toggle ${building}Door`)
        unlockTownBuildingDoor(building);

        // specific rules for the stadium because player can enter from both sides of each rooms
        const ROOF_BACKSTAGE = "roofs/backstage1";
        const ROOF_STADIUM = "roofs/stadium1";

        switch (building)
        {
            case "service":
                if (playerPosition === "BACK")
                {
                    WA.room.hideLayer(ROOF_BACKSTAGE);
                    WA.room.hideLayer(ROOF_STADIUM);
                } else if (playerPosition === "BACKSTAGE")
                {
                    WA.room.showLayer(ROOF_BACKSTAGE);
                    WA.room.showLayer(ROOF_STADIUM);
                }
                break;
            case "backstage":
                if (playerPosition === "BACKSTAGE")
                {
                    WA.room.showLayer(ROOF_BACKSTAGE);
                } else if (playerPosition === "AUDITORIUM")
                {
                    WA.room.hideLayer(ROOF_BACKSTAGE);
                }
                break;
            case "stadium":
                if (playerPosition === "AUDITORIUM")
                {
                    WA.room.showLayer(ROOF_STADIUM);
                } else if (playerPosition === "FRONT")
                {
                    WA.room.hideLayer(ROOF_STADIUM);
                }
                break;
            default:
                if (isRoofVisible === true)
                {
                    console.log(`was visible before`)
                    isRoofVisible = false
                    console.log(`hide all roofs`)
                    WA.room.hideLayer(`roofs/${building}1`)
                    WA.room.hideLayer(`roofs/${building}2`)
                } else
                {
                    console.log(`was hidden before`)
                    isRoofVisible = true
                    console.log(`show all roofs`)
                    WA.room.showLayer(`roofs/${building}1`)
                    WA.room.showLayer(`roofs/${building}2`)
                }
                break;
        }
    }

    // Default visibility of the roofs
    let isRoofVisible = true;

    // Subscribe to onEnter and onLeave events for the door area
    WA.room.area.onEnter(`${building}Door`).subscribe(() =>
    {
        console.log("onEnter", `${building}Door`)
        console.log("has access", townBuildings[building].access)
        if (townBuildings[building].access)
        {
            handleEnter();
        } else
        {
            openErrorBanner();
        }
    });

    WA.room.area.onLeave(`${building}Door`).subscribe(() =>
    {
        console.log("onLeave", `${building}Door`)
        if (!townBuildings[building].access)
        {
            console.log("closeBanner")
            closeBanner();
        }
    });

    // Lock the door if access is denied
    if (!townBuildings[building].access)
    {
        console.log("lock door")
        lockTownBuildingDoor(building);
    }
}

function initHrDoors(meetingDoor: HrMeetingDoorName)
{
    const currentValue = WA.state.loadVariable(`${meetingDoor}Variable`) as boolean
    hrMeetingDoors[meetingDoor].access = currentValue

    // initialize the default door state
    toggleHrMeetingDoor(meetingDoor)
}

function listenHrDoors(meetingDoor: HrMeetingDoorName)
{
    let actionMessage: ActionMessage | null

    // only HRs or admins can open/close the doors
    if (playerTagsStore.isHr())
    {
        WA.room.area.onEnter(meetingDoor).subscribe(() =>
        {
            // display an action message to open or close
            // that will depend on the current door state
            actionMessage = WA.ui.displayActionMessage({
                message: `Press SPACE to ${hrMeetingDoors[meetingDoor].access ? 'close' : 'open'} the door`,
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                callback: async () =>
                {
                    await WA.state.saveVariable(`${meetingDoor}Variable`, !hrMeetingDoors[meetingDoor].access);
                }
            })
        })

        // remove the action message after leaving the area
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        WA.room.area.onLeave(meetingDoor).subscribe(async () =>
        {
            await actionMessage?.remove().then(() =>
            {
                actionMessage = null
            })
        })
    }

    // Each HR door has a dedicated variable, when HR wants to toggle the state of door
    // we intercept the value here and we toggle it
    WA.state.onVariableChange(`${meetingDoor}Variable`).subscribe((value) =>
    {
        hrMeetingDoors[meetingDoor].access = value as boolean
        toggleHrMeetingDoor(meetingDoor)
    });
}

function toggleHrMeetingDoor(meetingDoor: HrMeetingDoorName)
{
    const meetingDoorData = hrMeetingDoors[meetingDoor];
    const tilesCoordinates = getTilesByRectangleCorners(meetingDoorData.tilesCoordinates[0], meetingDoorData.tilesCoordinates[1])

    // Find the tile name, like: hr-meeting-door-closed
    // exact name with its number will be found down here, like: hr-meeting-door-closed-1
    const tileName = `${meetingDoorData.tilesNamePattern}-${hrMeetingDoors[meetingDoor].access ? 'open' : 'closed'}`
    const tiles = tilesCoordinates.map(([xCoord, yCoord], index) => ({
        x: xCoord,
        y: yCoord,
        tile: `${tileName}-${index + 1}`,
        layer: "furniture/furniture2"
    }));

    WA.room.setTiles(tiles);
}

function lockTownBuildingDoor(building: TownBuildingName)
{
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

export function unlockTownBuildingDoor(building: TownBuildingName)
{
    townBuildings[building].access = true;
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

function initTownCaveDoors()
{
    Object.keys(townCaveProfileDoors).forEach(door =>
    {
        if (townCaveProfileDoors[door as NewbieTag].access === true)
        {
            unlockTownCaveDoor(door as NewbieTag)
        }
    });
}

export function unlockTownCaveDoor(door: NewbieTag)
{
    townCaveProfileDoors[door].access = true;
    const doorData = townCaveProfileDoors[door];

    const pillarTilesCoordinates = getTilesByRectangleCorners(doorData.pillar[0], doorData.pillar[1])
    const leftWallTilesCoordinates = getTilesByRectangleCorners(doorData.leftWall[0], doorData.leftWall[1])
    const rightWallTilesCoordinates = getTilesByRectangleCorners(doorData.rightWall[0], doorData.rightWall[1])


    const pillarTiles = pillarTilesCoordinates.map(([xCoord, yCoord], index) => ({
        x: xCoord,
        y: yCoord,
        tile: `no-pillar-${index + 1}`,
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

export function getCaveDoorToOpen(): NewbieTag | null
{
    // get the cave door to open depending on the player tags
    let door: NewbieTag | null = null

    if (playerTagsStore.hasFrProfile())
    {
        door = "fr"
    } else if (playerTagsStore.hasDeProfile())
    {
        door = "de"
    } else if (playerTagsStore.hasPtProfile())
    {
        door = "pt"
    } else if (playerTagsStore.hasAltProfile())
    {
        door = "alt"
    } else if (playerTagsStore.hasExtProfile())
    {
        door = "ext"
    }

    return door
}

/*
********************************************* WORLD *********************************************
*/

// Define buildings and their minimal access restrictions.
const worldBuildings: WorldBuildingAccess = {
    cave: { access: false, blockingTiles: [[28, 181], [29, 182]] },
    airport: { access: false, blockingTiles: [[51, 22], [53, 22]] },
};

// Define buildings and their minimal access restrictions.
const worldBarriers: WorldBarrierAccess = {
    achievements: { access: false, blockingTiles: [[84, 168], [86, 168]] },
    values: { access: false, blockingTiles: [[61, 160], [61, 162]] },
    legal: { access: false, blockingTiles: [[37, 109], [37, 110]] },
    bridge: { access: false, blockingTiles: [[18, 83], [21, 83]] },
    france: { access: false, blockingTiles: [[19, 66], [21, 68]] },
    hungary: { access: false, blockingTiles: [[91, 59], [92, 59]] },
    germany: { access: false, blockingTiles: [[104, 27], [105, 27]] },
    netherlands: { access: false, blockingTiles: [[71, 21], [74, 21]] },
};

const airportGate: AirportGateAccess =
    { access: false, turnstile: [[52, 11], [52, 12]], lightsY: [[52, 6], [52, 10]], lightsX: [[48, 5], [52, 5]] }

const brTowerFloors: BrTowerFloorAccess = {
    floor4: { access: false, tilesNamePattern: "rooftop-to-floor4", tilesCoordinates: [[23, 117], [23, 117]] },
    floor3: { access: false, tilesNamePattern: "floor4-to-floor3", tilesCoordinates: [[22, 126], [25, 126]] },
    floor2: { access: false, tilesNamePattern: "floor3-to-floor2", tilesCoordinates: [[22, 133], [25, 133]] },
    floor1: { access: false, tilesNamePattern: "floor2-to-floor1", tilesCoordinates: [[22, 140], [25, 140]] },
    floor0: { access: false, tilesNamePattern: "floor1-to-floor0", tilesCoordinates: [[22, 147], [25, 147]] },
    exit: { access: false, tilesNamePattern: "floor0-to-exit", tilesCoordinates: [[22, 154], [25, 154]] },
};

function initWorldDoors()
{
    // Apply access restrictions based on player checkpoint
    worldBuildings.cave.access = checkpointIdsStore.canLeaveCaveWorld();
    worldBuildings.airport.access = checkpointIdsStore.canEnterAirport();

    worldBarriers.achievements.access = checkpointIdsStore.canAccessAchievements();
    worldBarriers.values.access = checkpointIdsStore.canAccessValues();
    worldBarriers.legal.access = checkpointIdsStore.canAccessLegal();
    worldBarriers.bridge.access = checkpointIdsStore.canAccessBridge();
    worldBarriers.france.access = checkpointIdsStore.canAccessFrance();
    worldBarriers.hungary.access = checkpointIdsStore.canAccessHungary();
    worldBarriers.germany.access = checkpointIdsStore.canAccessGermany();
    worldBarriers.netherlands.access = checkpointIdsStore.canAccessNetherlands();

    airportGate.access = checkpointIdsStore.canEnterAirportGates();

    brTowerFloors.floor4.access = checkpointIdsStore.canEnterBRTower()
    brTowerFloors.floor3.access = checkpointIdsStore.canEnterBRTowerFloor3()
    brTowerFloors.floor2.access = checkpointIdsStore.canEnterBRTowerFloor2()
    brTowerFloors.floor1.access = checkpointIdsStore.canEnterBRTowerFloor1()
    brTowerFloors.floor0.access = checkpointIdsStore.canEnterBRTowerFloor0()
    brTowerFloors.exit.access = checkpointIdsStore.canLeaveBRTower()

    // unlock all doors if employee
    if (playerTagsStore.isEmployee())
    {
        console.log("Open all world buildings")
        Object.keys(worldBuildings).forEach(building =>
        {
            worldBuildings[building as WorldBuildingName].access = true;
        });
        Object.keys(worldBarriers).forEach(barrier =>
        {
            worldBarriers[barrier as WorldBarrierName].access = true;
        });

        airportGate.access = true;

        Object.keys(brTowerFloors).forEach(floor =>
        {
            brTowerFloors[floor as BrTowerFloorName].access = true;
        });
    }


    for (const key in worldBuildings)
    {
        listenWorldDoor(key as WorldBuildingName);
    }

    listenHelicopterDoor()

    tryToUnlockWorldBarriers()

    if (airportGate.access)
    {
        unlockAirportGate()
    }

    initBrTowerFloorAccess()

    listenWorldExits("town")

    console.log("worldBuildings", worldBuildings)
    console.log("worldBarriers", worldBarriers)
    console.log("airportGate", airportGate)
    console.log("brTowerFloors", brTowerFloors)
}

function listenWorldExits(exit: string)
{
    console.log("listenWorldExits()")

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    WA.room.area.onEnter(`to-${exit}`).subscribe(async () =>
    {
        await goToRoom("town", "from-world")
    });
}

function listenWorldDoor(building: WorldBuildingName)
{
    console.log("> listenWorldDoor()")

    function handleEnter()
    {
        console.log(`toggle ${building}Door`)
        unlockWorldBuildingDoor(building);
        if (isRoofVisible === true)
        {
            console.log(`was visible before`)
            isRoofVisible = false
            console.log(`hide layer`)
            WA.room.hideLayer(`roofs/${building}1`)
        } else
        {
            console.log(`was hidden before`)
            isRoofVisible = true
            console.log(`show layer`)
            WA.room.showLayer(`roofs/${building}1`)
        }
    }

    // Default visibility of the roofs
    // (player starts inside the cave so its roof has to be hidden)
    let isRoofVisible = building !== "cave"

    // Subscribe to onEnter and onLeave events for the door area
    WA.room.area.onEnter(`${building}Door`).subscribe(() =>
    {
        console.log("onEnter", `${building}Door`)
        console.log("has access", worldBuildings[building].access)
        if (worldBuildings[building].access)
        {
            console.log("access")
            handleEnter();
        } else
        {
            console.log("no access")
            openErrorBanner();
        }
    });

    WA.room.area.onLeave(`${building}Door`).subscribe(() =>
    {
        console.log("onLeave", `${building}Door`)
        if (!worldBuildings[building].access)
        {
            console.log("closeBanner")
            closeBanner();
        }
    });

    // Lock the door if access is denied
    if (!worldBuildings[building].access)
    {
        lockWorldBuildingDoor(building);
    }
}

function listenHelicopterDoor()
{
    // Give access to the helicopter and the pickup only for employees
    // (even if they didn't talk with Jonas previously, they still need to go to the BR Tower)
    if (playerTagsStore.isEmployee())
    {
        let actionMessage: ActionMessage | null

        WA.room.area.onEnter("helicopterDoor").subscribe(() =>
        {
            actionMessage = WA.ui.displayActionMessage({
                message: "Press SPACE to fly to the BR Tower rooftop!",
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                callback: async () =>
                {
                    await travelFromAirportToRooftop()
                }
            })
        })

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        WA.room.area.onLeave("helicopterDoor").subscribe(async () =>
        {
            await actionMessage?.remove().then(() =>
            {
                actionMessage = null
            })
        })

        WA.room.area.onEnter("pickupDoor").subscribe(() =>
        {
            actionMessage = WA.ui.displayActionMessage({
                message: "Press SPACE to drive back to the BR Stadium!",
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                callback: async () =>
                {
                    await goToRoom("town", "from-tower")
                }
            })
        })

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        WA.room.area.onLeave("pickupDoor").subscribe(async () =>
        {
            await actionMessage?.remove().then(() =>
            {
                actionMessage = null
            })
        })
    }
}

function lockWorldBuildingDoor(building: WorldBuildingName)
{
    console.log("lockWorldBuildingDoor", building)
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

export function unlockWorldBuildingDoor(building: WorldBuildingName)
{
    console.log("unlockWorldBuildingDoor", building)
    worldBuildings[building].access = true;
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

function tryToUnlockWorldBarriers()
{
    console.log("tryToUnlockWorldBarriers()")
    const tiles: TileDescriptor[] = [];

    // Iterate over each barrier in the worldBarriers object
    Object.entries(worldBarriers).forEach(([_barrierName, barrierData]) =>
    {
        console.log("barrierName", _barrierName)
        // Check if the barrier is accessible
        if (barrierData.access)
        {
            console.log("has access")
            // Iterate over the blocking tiles of the barrier and add them to the tiles array
            const tilesCoordinates = getTilesByRectangleCorners(barrierData.blockingTiles[0], barrierData.blockingTiles[1])
            tilesCoordinates.forEach(([xCoord, yCoord]) =>
            {
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

export function unlockWorldBarrier(barrier: WorldBarrierName)
{
    worldBarriers[barrier].access = true;
    const barrierData = worldBarriers[barrier];
    console.log("barrierData", barrierData)
    const tilesCoordinates = getTilesByRectangleCorners(barrierData.blockingTiles[0], barrierData.blockingTiles[1])
    console.log("tilesCoordinates", tilesCoordinates)
    const tiles = tilesCoordinates.map(([xCoord, yCoord]) => ({
        x: xCoord,
        y: yCoord,
        tile: null,
        layer: "walls/walls1"
    }));

    WA.room.setTiles(tiles);
}

export function unlockAirportGate()
{
    console.log("unlockAirportGate()")
    airportGate.access = true;
    const turnstileTilesCoordinates = getTilesByRectangleCorners(airportGate.turnstile[0], airportGate.turnstile[1])

    const turnstileTiles = turnstileTilesCoordinates.map(([xCoord, yCoord], index) => ({
        x: xCoord,
        y: yCoord,
        tile: `airport-turnstile-open-${index + 1}`,
        layer: "furniture/furniture3"
    }));
    const combinedTiles = turnstileTiles
    WA.room.setTiles(combinedTiles);
}

function lockBrTowerFloorAccess(floor: BrTowerFloorName)
{
    console.log("lockBrTowerFloorAccess()", floor)

    const tiles: TileDescriptor[] = [];
    const floorData = brTowerFloors[floor];
    const floorToLayerNameMap: { [key in BrTowerFloorName]: string } = {
        "floor4": "walls/walls2",
        "floor3": "tower/4",
        "floor2": "tower/3",
        "floor1": "tower/2",
        "floor0": "tower/1",
        "exit": "tower/0"
    };
    const tilesCoordinates = getTilesByRectangleCorners(floorData.tilesCoordinates[0], floorData.tilesCoordinates[1])

    // first we need to remove open door
    tilesCoordinates.forEach(([xCoord, yCoord]) =>
    {
        tiles.push({
            x: xCoord,
            y: yCoord,
            tile: null,
            layer: floorToLayerNameMap[floor]
        });
    })

    // then place the wall
    tilesCoordinates.forEach(([xCoord, yCoord]) =>
    {
        tiles.push({
            x: xCoord,
            y: yCoord,
            tile: floor !== "floor4" ? "br-tower-floor-wall" : "br-tower-rooftop-closed",
            layer: floorToLayerNameMap[floor]
        });
    })

    // Lock access for the unaccessible floors
    WA.room.setTiles(tiles);
}

export function unlockBrTowerFloorAccess(floor: BrTowerFloorName)
{
    console.log("unlockBrTowerFloorAccess()", floor)

    const tiles: TileDescriptor[] = [];
    const floorData = brTowerFloors[floor];
    const floorToLayerNameMap: { [key in BrTowerFloorName]: string } = {
        "floor4": "walls/walls2",
        "floor3": "tower/4",
        "floor2": "tower/3",
        "floor1": "tower/2",
        "floor0": "tower/1",
        "exit": "tower/0"
    };
    const tilesCoordinates = getTilesByRectangleCorners(floorData.tilesCoordinates[0], floorData.tilesCoordinates[1])

    // first we need to remove the wall
    tilesCoordinates.forEach(([xCoord, yCoord]) =>
    {
        tiles.push({
            x: xCoord,
            y: yCoord,
            tile: null,
            layer: floorToLayerNameMap[floor]
        });
    })

    // then place the open door
    tilesCoordinates.forEach(([xCoord, yCoord], index) =>
    {
        tiles.push({
            x: xCoord,
            y: yCoord,
            tile: `${floorData.tilesNamePattern}-open-${index + 1}`,
            layer: floorToLayerNameMap[floor]
        });
    })

    // Unlock access for the accessible floors
    WA.room.setTiles(tiles);
}

function initBrTowerFloorAccess()
{
    Object.keys(brTowerFloors).forEach(floor =>
    {
        if (brTowerFloors[floor as BrTowerFloorName].access === true)
        {
            unlockBrTowerFloorAccess(floor as BrTowerFloorName)
        } else
        {
            lockBrTowerFloorAccess(floor as BrTowerFloorName)
        }
    });
}
