import type { BrTowerFloor } from "../Types/Maps";

/**
 * The production Town map URL as it is set in the admin
 * @constant
 */
export const townMapUrl = "/@/bedrock-1710774685/onboardingbr/town"

/**
 * The production E-Learning map URL as it is set in the admin
 * @constant
 */
export const worldMapUrl = "/@/bedrock-1710774685/onboardingbr/e-learning"

/**
 * All floors of the BR Tower
 * @constant
 */
export const brTowerFloors: BrTowerFloor[] = ['ext', '0', '1', '2', '3', '4', 'roof'];

/**
 * Coordinates of each BR Tower floor content/NPC location
 * This is used for showing or hiding content based on the floor transition 
 * @constant
 */
export const floorToBuildingTileCoordMap: { [key in BrTowerFloor]: { x: number, y: number } | null } = {
    "roof": null,
    "4": { x: 31, y: 124 },
    "3": { x: 29, y: 129 },
    "2": { x: 29, y: 137 },
    "1": { x: 17, y: 143 },
    "0": { x: 28, y: 150 },
    "ext": null,
}
