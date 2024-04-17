import type { Tag } from "../Type/Tags";

export function getPlayerTags(): Tag[] {
    return WA.player.tags as Tag[]
}