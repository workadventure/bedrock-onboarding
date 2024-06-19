/*
********************************************* TOWN *********************************************
*/

import type { NewbieTag } from "./Tags";

export type TownBuildingName = "hr" | "arcade" | "stadium" | "wikitech" | "streaming" | "cave" | "backstage" | "service";
export type TownBuildingAccess = {
    [key in TownBuildingName]: { access: boolean, blockingTiles: [number, number][] };
};

export type TownCaveDoorAccess = {
    [key in NewbieTag]: { access: boolean, leftWall: [number, number][], rightWall: [number, number][], pillar: [number, number][] };
};

export type HrMeetingDoorName = "hrMeetingDoor1" | "hrMeetingDoor2" | "hrMeetingDoor3" | "hrMeetingDoor4";
export type HRMeetingDoorAccess = {
    [key in HrMeetingDoorName]: { access: boolean, tilesNamePattern: string, tilesCoordinates: [number, number][] };
};

/*
********************************************* WORLD *********************************************
*/

export type WorldBuildingName = "cave" | "airport";
export type WorldBuildingAccess = {
    [key in WorldBuildingName]: { access: boolean, blockingTiles: [number, number][] };
};

export type WorldBarrierName = "achievements" | "values" | "legal" | "bridge" | "france" | "hungary" | "belgium" | "netherlands";
export type WorldBarrierAccess = {
    [key in WorldBarrierName]: { access: boolean, blockingTiles: [number, number][] };
};

export type AirportGateAccess = { access: boolean, turnstile: [number, number][], lightsY: [number, number][], lightsX: [number, number][] };

export type BrTowerFloorName = "exit" | "floor0" | "floor1" | "floor2" | "floor3" | "floor4";
export type BrTowerFloorAccess = {
    [key in BrTowerFloorName]: { access: boolean, tilesNamePattern: string, tilesCoordinates: [number, number][] };
};