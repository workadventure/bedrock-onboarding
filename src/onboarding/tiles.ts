/// <reference types="@workadventure/iframe-api-typings" />

import { CheckpointDescriptor, isCheckpointJonasPhone } from './checkpoints';

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

function placeNPCTile(checkpoint: CheckpointDescriptor) {
    console.log(`Placing checkpoint ${checkpoint.id} (NPC tile)`)
    if (checkpoint.npcName && checkpoint.npcSprite) {
        const lowercaseName = checkpoint.npcName.toLowerCase()

        WA.room.setTiles([
            {
                x: checkpoint.coordinates.x,
                y: checkpoint.coordinates.y,
                tile: `npc-${lowercaseName}-${checkpoint.npcSprite}`,
                layer: "furniture/furniture3"
            },
        ])
    }
}

function placeContentTile(checkpoint: CheckpointDescriptor) {
    console.log(`Placing checkpoint ${checkpoint.id} (content tile)`)

    WA.room.setTiles([
        {
            x: checkpoint.coordinates.x,
            y: checkpoint.coordinates.y,
            tile: 'content',
            layer: "furniture/furniture1"
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
            layer: "furniture/furniture3"
        },
    ])
}

export function removeContentTile(checkpoint: CheckpointDescriptor) {
    WA.room.setTiles([
        {
            x: checkpoint.coordinates.x,
            y: checkpoint.coordinates.y,
            tile: null,
            layer: "furniture/furniture1"
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

// Generates in-between range of tiles coordinates from top-left and bottom-right coordinates
export function getTilesByRectangleCorners(topLeft: number[], bottomRight: number[]): number[][] {
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