import type { Map } from "./Maps";
import type { Tag } from "./Tags";

export type NPC = "Aria" | "Baptiste" | "Charlie" | "Caroline" | "Diana" | "Emilie" | "Emma" | "Eva" | "Gabor" | "Hans" | "Ingrid" | "Jonas" | "Julia" | "Chrystel" | "Luc" | "Murielle" | "Nicolas" | "Pierre" | "Shiby" | "Vianey";

export interface CheckpointDescriptor {
    id: string;
    map: Map;
    title: string;
    description: string;
    coordinates: {
        x: number;
        y: number;
    }
    type: "NPC" | "content" | "direction";
    xp: number;
    message?: string;
    url?: string;
    tags?: Tag[];
    npcName?: NPC;
    npcSprite?: "front" | "left" | "right" | "back";
}

export interface Checklist {
    id: string;
    title: string;
    done: boolean;
}
