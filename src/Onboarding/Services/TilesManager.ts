/// <reference types="@workadventure/iframe-api-typings" />

import { TileDescriptor } from "@workadventure/iframe-api-typings";
import { floorToBuildingTileCoordMap } from "../Constants/Maps";
import { getTilesByRectangleCorners } from "../Utils/Tiles";
import { CheckpointDescriptor } from "../Types/Checkpoints"
import type { BrTowerFloor } from "../Types/Maps";
import { checkpointIdsStore } from "../State/Properties/CheckpointIdsStore"
import { removeArea } from "./AreasManager"

export function placeTile(checkpoint: CheckpointDescriptor) {
    if (checkpoint.type === "NPC") {
        placeNPCTile(checkpoint)
    } else if (checkpoint.type === "content") {
        placeContentTile(checkpoint)
    } else if (checkpoint.type === "direction") {
        placeDirectionTile(checkpoint)
    } else {
        console.error("Invalid area type while placing tile")
    }
}

export function placeNPCTile(checkpoint: CheckpointDescriptor) {
    console.log(`Placing checkpoint ${checkpoint.id} (NPC tile)`)
    if (checkpoint.npcName && checkpoint.npcSprite) {
        const lowercaseName = checkpoint.npcName.toLowerCase()

        WA.room.setTiles([
            {
                x: checkpoint.coordinates.x,
                y: checkpoint.coordinates.y,
                tile: `npc-${lowercaseName}-${checkpoint.npcSprite}`,
                layer: checkpointIdsStore.isCheckpointInBrTower(checkpoint.id) ? "tower/content" : "furniture/furniture3"
            },
        ])
    }
}

export function placeContentTile(checkpoint: CheckpointDescriptor) {
    console.log(`Placing checkpoint ${checkpoint.id} (content tile)`)

    WA.room.setTiles([
        {
            x: checkpoint.coordinates.x,
            y: checkpoint.coordinates.y,
            tile: 'content',
            layer: checkpointIdsStore.isCheckpointInBrTower(checkpoint.id) ? "tower/content" : "furniture/furniture1"
        },
    ])


    if (checkpointIdsStore.isCheckpointJonasPhone(checkpoint.id)) {
        // place smartphone above content tile
        WA.room.setTiles([
            {
                x: checkpoint.coordinates.x,
                y: checkpoint.coordinates.y,
                tile: 'smartphone',
                layer: "furniture/furniture2"
            },
        ])
    }
}

export function removeNPCTile(checkpoint: CheckpointDescriptor) {
    WA.room.setTiles([
        {
            x: checkpoint.coordinates.x,
            y: checkpoint.coordinates.y,
            tile: null,
            layer: checkpointIdsStore.isCheckpointInBrTower(checkpoint.id) ? "tower/content" : "furniture/furniture3"
        },
    ])
}

export async function removeContentTile(checkpoint: CheckpointDescriptor) {
    WA.room.setTiles([
        {
            x: checkpoint.coordinates.x,
            y: checkpoint.coordinates.y,
            tile: null,
            layer: checkpointIdsStore.isCheckpointInBrTower(checkpoint.id) ? "tower/content" : "furniture/furniture1"
        },
    ])

    if (checkpointIdsStore.isCheckpointJonasPhone(checkpoint.id)) {
        // remove smartphone
        await removeArea(checkpoint.id)
        WA.room.setTiles([
            {
                x: checkpoint.coordinates.x,
                y: checkpoint.coordinates.y,
                tile: null,
                layer: "furniture/furniture2"
            },
        ])
    }
}

function placeDirectionTile(checkpoint: CheckpointDescriptor) {
    console.log(`Placing checkpoint ${checkpoint.id} (direction tile)`)
    WA.room.setTiles([
        {
            x: checkpoint.coordinates.x,
            y: checkpoint.coordinates.y,
            tile: 'direction',
            layer: "furniture/furniture1"
        },
    ])
}

export function removeDirectionTile(checkpoint: CheckpointDescriptor) {
    WA.room.setTiles([
        {
            x: checkpoint.coordinates.x,
            y: checkpoint.coordinates.y,
            tile: null,
            layer: "furniture/furniture1"
        },
    ])
}

export function teleportJonas(xCoord: number, yCoord: number) {
    // display Jonas turning animation
    animateJonasTurning(xCoord, yCoord)
    animateTeleportHalo(xCoord, yCoord)
}

function animateJonasTurning(xCoord: number, yCoord: number) {
    const animationDuration = 1000

    WA.room.setTiles([
        {
            x: xCoord,
            y: yCoord,
            tile: "npc-jonas-tp",
            layer: "furniture/furniture3"
        }
    ]);

    // Stop the animation after a certain duration
    setTimeout(() => {
        WA.room.setTiles([
            {
                x: xCoord,
                y: yCoord,
                tile: null,
                layer: "furniture/furniture3"
            }
        ]);
    }, animationDuration);
}

function animateTeleportHalo(xCoord: number, yCoord: number) {
    const frameDuration = 100
    const frameNumber = 18
    const animationDuration = frameDuration * frameNumber

    const offsets = [
        { dx: -1, dy: -1, id: 1 }, // Tile 1
        { dx: 0, dy: -1, id: 2 },  // Tile 2
        { dx: 1, dy: -1, id: 3 },  // Tile 3
        { dx: -1, dy: 0, id: 4 },  // Tile 4
        { dx: 0, dy: 0, id: 5 },   // Tile 5 (Center)
        { dx: 1, dy: 0, id: 6 },   // Tile 6
        { dx: -1, dy: 1, id: 7 },  // Tile 7
        { dx: 0, dy: 1, id: 8 },   // Tile 8
        { dx: 1, dy: 1, id: 9 },   // Tile 9
    ];

    const tiles = offsets.map(({ dx, dy, id }) => ({
        x: xCoord + dx,
        y: yCoord + dy,
        tile: `teleport-${id}`,
        layer: "above/above1",
    }))

    WA.room.setTiles(tiles)

    // Stop the animation after a certain duration
    setTimeout(() => {
        const noTiles = offsets.map(({ dx, dy }) => ({
            x: xCoord + dx,
            y: yCoord + dy,
            tile: null,
            layer: "above/above1",
        }))
        WA.room.setTiles(noTiles)
    }, animationDuration)
}

export function removeHelicopterTiles() {
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

export function placeRooftopHelicopter() {
    console.log("placeRooftopHelicopter()")
    const tilesCoordinates = getTilesByRectangleCorners([26, 114], [32, 118])
    const tiles = tilesCoordinates.map(([xCoord, yCoord], index) => ({
        x: xCoord,
        y: yCoord,
        tile: `helicopter-landed-${index + 1}`,
        layer: "above/above1"
    }));

    WA.room.setTiles(tiles);
}

// Hide the NPCs or content of BR Tower floors by
// placing a building tile above them when the floor is hidden
// That's a trick I found because I am limited in terms of layers
export function placeTileBrTowerFloor(floor: BrTowerFloor) {
    const tiles: TileDescriptor[] = [];

    const contentCoord = floorToBuildingTileCoordMap[floor];
    if (contentCoord !== null) {
        console.log("place building tile on coordinates", contentCoord)
        tiles.push({
            x: contentCoord.x,
            y: contentCoord.y,
            tile: `hide-checkpoint-floor-${floor}`,
            layer: "above/above2"
        });
    }

    WA.room.setTiles(tiles);
}

// Show the NPCs or content of BR Tower floors by
// removing a building tile above them when the floor is visible
// That's a trick I found because I am limited in terms of layers
export function removeTileBrTowerFloor(floor: BrTowerFloor) {
    const tiles: TileDescriptor[] = [];

    const contentCoord = floorToBuildingTileCoordMap[floor];
    if (contentCoord !== null) {
        console.log("remove building tile on coordinates", contentCoord)
        tiles.push({
            x: contentCoord.x,
            y: contentCoord.y,
            tile: null,
            layer: "above/above2"
        });
    }

    WA.room.setTiles(tiles);
}