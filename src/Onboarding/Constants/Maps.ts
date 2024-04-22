import type { BrTowerFloor } from "../Types/Maps";

/**
 * The production Town map URL as it is set in the admin
 * @constant
 */
export const townMapUrl = "/@/tcm/workadventure/br-town"
//export const townMapUrl = "/@/bedrock-1710774685/onboardingbr/town"

/**
 * The production E-Learning map URL as it is set in the admin
 * @constant
 */
export const worldMapUrl = "/@/tcm/workadventure/br-e-learning"
//export const worldMapUrl = "/@/bedrock-1710774685/onboardingbr/e-learning"

/**
 * All floors of the BR Tower
 * @constant
 */
export const brTowerFloors: BrTowerFloor[] = ['ext', '0', '1', '2', '3', '4', 'roof'];

/**
 * Coordinates of each BR Tower floor content location
 * This is used for showing or hiding content based on the floor transition 
 * @constant
 */
export const floorToContentCoordMap: { [key in BrTowerFloor]: { x: number, y: number } | null } = {
    "roof": null,
    "4": { x: 31, y: 124 },
    "3": { x: 29, y: 129 },
    "2": { x: 29, y: 137 },
    "1": { x: 17, y: 143 },
    "0": { x: 28, y: 150 },
    "ext": null,
}

/**
 * Coordinates of collision tile in BR Tower floors
 * This is used for adding or removing floor collisions based on the floor transition 
 * @constant
 */
export const floorToCollisionsCoordMap: { [key in BrTowerFloor]: [number, number][]|null } = {
    "roof": null,
    "4": [[15, 122], [21, 122], [32, 122], [18, 124], [29, 123], [30, 123], [29, 124], [30, 124], [29, 125], [30, 125]],
    "3": [[16, 129], [17, 129], [15, 131], [16, 131], [17, 131], [18, 131], [15, 132], [16, 132], [17, 132], [18, 132], [20, 129], [20, 130], [20, 131], [28, 130], [29, 130], [30, 130], [28, 131], [29, 131], [30, 131], [28, 132], [29, 132], [30, 132]],
    "2": [[15, 136], [16, 136], [17, 136], [18, 136], [19, 136], [20, 136], [15, 137], [16, 137], [17, 137], [18, 137], [19, 137], [20, 137], [31, 137]],
    "1": [[16, 144], [17, 144], [16, 145], [17, 145], [19, 144], [20, 144], [19, 145], [20, 144], [19, 145], [20, 145], [27, 144], [28, 144], [27, 145], [30, 144], [31, 144], [30, 145], [31, 145], [16, 143], [16, 146], [17, 146], [20, 146], [28, 143], [28, 146], [30, 143], [30, 146], [31, 146]],
    "0": [[16, 150], [18, 152], [19, 152], [21, 150], [26, 150], [26, 151], [27, 151], [28, 151], [29, 151], [30, 151], [31, 151], [31, 150], [32, 150]],
    "ext": null,
}