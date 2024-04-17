/// <reference types="@workadventure/iframe-api-typings" />

import { TileDescriptor } from "@workadventure/iframe-api-typings";
import { floorToCollisionsCoordMap, floorToContentCoordMap } from "../Data/Maps";
import { isCheckpointInBrTour, isCheckpointJonasPhone } from "../Helpers/Checkpoints"
import { CheckpointDescriptor } from "../Type/Checkpoints"
import type { BrTourFloor } from "../Type/Maps";

export function placeTile(checkpoint: CheckpointDescriptor) {
    if (checkpoint.type === "NPC") {
        placeNPCTile(checkpoint)
    }  else if (checkpoint.type === "content") {
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
                layer: isCheckpointInBrTour(checkpoint.id) ? "tour/content" : "furniture/furniture3"
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
            layer: isCheckpointInBrTour(checkpoint.id) ? "tour/content" : "furniture/furniture1"
        },
    ])


    if (isCheckpointJonasPhone(checkpoint.id)) {
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
            layer:  isCheckpointInBrTour(checkpoint.id) ? "tour/content" : "furniture/furniture3"
        },
    ])
}

export function removeContentTile(checkpoint: CheckpointDescriptor) {
    WA.room.setTiles([
        {
            x: checkpoint.coordinates.x,
            y: checkpoint.coordinates.y,
            tile: null,
            layer:  isCheckpointInBrTour(checkpoint.id) ? "tour/content" : "furniture/furniture1"
        },
    ])

    if (isCheckpointJonasPhone(checkpoint.id)) {
        // remove smartphone
        WA.room.area.delete(checkpoint.id)
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

// Hide the NPCs or content of BR Tour floors by
// placing a building tile above them when the floor is hidden
export function placeTileBrTourFloor(floor: BrTourFloor) {
    let tiles: TileDescriptor[] = [];

    const contentCoord = floorToContentCoordMap[floor];
    if (contentCoord !== null) {
        console.log("place content tile on coordinates",contentCoord)
        tiles.push({
            x: contentCoord.x,
            y: contentCoord.y,
            tile: `hide-checkpoint-floor-${floor}`,
                layer: "above/above2"
        });
    }

    const collisionsCoord = floorToCollisionsCoordMap[floor];
    if (collisionsCoord !== null) {
        console.log("remove collision tiles on coordinates",collisionsCoord)
        collisionsCoord.forEach(([xCoord, yCoord]) => {
            tiles.push({
                x: xCoord,
                y: yCoord,
                tile: null,
                layer: "collisions"
            });
        })
    }

    WA.room.setTiles(tiles);
}

// Show the NPCs or content of BR Tour floors by
// removing a building tile above them when the floor is hidden
export function removeTileBrTourFloor(floor: BrTourFloor) {
    let tiles: TileDescriptor[] = [];

    const contentCoord = floorToContentCoordMap[floor];
    if (contentCoord !== null) {
        console.log("remove content tile on coordinates",contentCoord)
        tiles.push({
            x: contentCoord.x,
            y: contentCoord.y,
            tile: null,
            layer: "above/above2"
        });
    }

    const collisionsCoord = floorToCollisionsCoordMap[floor];
    if (collisionsCoord !== null) {
        console.log("add collision tiles on coordinates",collisionsCoord)
        collisionsCoord.forEach(([xCoord, yCoord]) => {
            tiles.push({
                x: xCoord,
                y: yCoord,
                tile: "collision",
                layer: "collisions"
            });
        })
    }

    WA.room.setTiles(tiles);
}