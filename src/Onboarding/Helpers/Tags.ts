import type { Tag } from "../Type/Tags";

export let playerTags: Tag[]

export async function initTags() {
    await WA.onInit().then(() => {
        console.log("playerTags before init", playerTags)
        playerTags = WA.player.tags as Tag[]
        console.log("playerTags after init", playerTags)
    })
}

export function getPlayerTags(): Tag[] {
    return WA.player.tags as Tag[]
}

export function isPlayerGuest(): boolean {
    return true
}