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