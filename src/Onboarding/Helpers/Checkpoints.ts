import { jonasCheckpointIds } from "../Data/Checkpoints";
import type { Checklist } from "../Type/Checkpoints";

export async function getChecklist(): Promise<Checklist[]> {
   let checklist: Checklist[] = [];

   const playerVariable = await WA.player.state.checklist as Checklist[]

   if (playerVariable) {
       checklist = playerVariable;
   } else {
       // If data is not present on the server, initialize it
       setChecklist(checklist)
   }

   return checklist;
}

export function setChecklist(checklist: Checklist[]): void {
   WA.player.state.saveVariable("checklist", checklist, {
       public: false,
       persist: true,
       ttl: 48 * 3600,
       scope: "world",
     });
}

export async function getCheckpointIds(): Promise<string[]> {
   let checkpointIds: string[] = [];

   // Fetch the data from the server
   const playerVariable = await WA.player.state.checkpointIds as string[]

   if (playerVariable) {
       checkpointIds = playerVariable;
   } else {
       // If data is not present on the server, initialize it
       setCheckpointIds(checkpointIds)
   }

   return checkpointIds;
}

export function setCheckpointIds(checkpointIds: string[]): void {
   WA.player.state.saveVariable("checkpointIds", checkpointIds, {
       public: false,
       persist: true,
       ttl: 48 * 3600,
       scope: "world",
     });
}

export function getNextCheckpointId(checklist: Checklist[]): string {
    // Find the first checklist item that is not done
    const nextCheckpoint = checklist.find(checkpoint => !checkpoint.done);

    // If a next checkpoint is found, return its ID; otherwise, return -1
    return nextCheckpoint ? nextCheckpoint.id : "-1";
}

export function getNextJonasCheckpointId(playerCheckpointIds: string[]): string {
    // Convert string elements to numbers for both playerCheckpointIds and jonasCheckpointIds
    const numericPlayerCheckpointIds: number[] = playerCheckpointIds.map(Number);
    const numericJonasCheckpoints: number[] = jonasCheckpointIds.map(Number);

    // Find the highest checkpoint ID the player has reached
    const maxPlayerCheckpointId = Math.max(...numericPlayerCheckpointIds);

    // Find the next Jonas checkpoint ID
    const nextJonasCheckpointId = numericJonasCheckpoints.find(id => id > maxPlayerCheckpointId);

    // If there is a next Jonas checkpoint, return its ID as a string; otherwise, return "-1"
    return nextJonasCheckpointId !== undefined ? nextJonasCheckpointId.toString() : "-1";
}

export function isCheckpointPassed(playerCheckpointIds: string[], checkpointId: string): boolean {
   return playerCheckpointIds.includes(checkpointId);
}

export function hasPlayerMetJonas(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("2");
}

export function isCheckpointAfterFirstJonas(checkpointId: string): boolean {
   // Don't display rest of checkpoints if player did not meet Jonas
   const checkpointIdNumber = parseInt(checkpointId, 10);
   return checkpointIdNumber > 2;
}

export function canEnterCaveWorld(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("4");
}

export function hasPlayerTalkedWithJonasInTheCave(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("6");
}

export function isCheckpointJonasPhone(checkpointId: string): boolean {
   return checkpointId === "7";
}

export function canLeaveCaveWorld(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("7");
}

export function canAccessAchievements(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("9");
}

export function canAccessValues(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("10");
}

export function canAccessLegal(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("11");
}

export function canAccessBridge(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("12");
}

export function canAccessFrance(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("13");
}

export function canAccessHungary(playerCheckpointIds: string[]): boolean {
   return ["14", "15"].every(id => playerCheckpointIds.includes(id));
}

export function canAccessBelgium(playerCheckpointIds: string[]): boolean {
   return ["16", "17"].every(id => playerCheckpointIds.includes(id));
}

export function canAccessNetherlands(playerCheckpointIds: string[]): boolean {
   return ["18", "19"].every(id => playerCheckpointIds.includes(id));
}

export function canEnterAirport(playerCheckpointIds: string[]): boolean {
   return ["20", "21"].every(id => playerCheckpointIds.includes(id));
}

export function canEnterAirportGates(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("22");
}

export function canEnterBRTower(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("24");
}

export function isCheckpointInBrTower(checkpointId: string): boolean {
   const checkpointIdNumber = parseInt(checkpointId, 10);
   return 25 <= checkpointIdNumber && checkpointIdNumber <= 29;
}

export function canEnterBRTowerFloor3(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("25");
}

export function canEnterBRTowerFloor2(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("26");
}

export function canEnterBRTowerFloor1(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("27");
}

export function canEnterBRTowerFloor0(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("28");
}

export function canLeaveBRTower(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("29");
}

export function isWorldMapDone(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("32");
}

export function canLeaveBackstage(playerCheckpointIds: string[]): boolean {
   return ["33", "34"].every(id => playerCheckpointIds.includes(id));
}

export function isOnboardingDone(playerCheckpointIds: string[]): boolean {
   return playerCheckpointIds.includes("34");
}

export function isCheckpointAfterOnboarding(checkpointId: string): boolean {
   // Don't display checkpoints after on boarding if it's not done yet
   const checkpointIdNumber = parseInt(checkpointId, 10);
   return checkpointIdNumber > 34;
}
