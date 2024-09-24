/// <reference types="@workadventure/iframe-api-typings" />
import type { Map } from '../../src/Onboarding/Types/Maps';
import { mapUrl } from "../../src/Onboarding/Constants/Maps";

console.info('"Resume Popup" script started successfully')

let map: Map|undefined

window.onload = async () => {
    WA.onInit().then(async () => {
        const url = new URL(window.location.toString())
        const map = url.searchParams.get("map") as Map
        console.log("Can teleport to ",map)

        const cancelButton = document.getElementById('cancel-btn') as HTMLButtonElement
        const teleportButton = document.getElementById('teleport-btn') as HTMLButtonElement

        cancelButton.addEventListener('click', () => {
            cancel()
        })
        teleportButton.addEventListener('click', () => {
            teleport(map)
        })
    })
};

async function cancel() {
    WA.controls.restorePlayerControls()

    const iframeId = WA.iframeId;
    if (iframeId) {
        const iframe = await WA.ui.website.getById(iframeId);
        iframe?.close()
    }
}

function teleport(map: Map) {
    WA.controls.restorePlayerControls()

    if (map) {
        console.log("teleporting to map",mapUrl[map])
        WA.nav.goToRoom(mapUrl[map])
    }
}