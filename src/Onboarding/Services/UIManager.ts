/// <reference types="@workadventure/iframe-api-typings" />

import { CoWebsite, UIWebsite } from "@workadventure/iframe-api-typings";
import { checkpoints } from "../Constants/Checkpoints";
import { isURL, mustOpenInNewTab } from "../Utils/UI";
import { rootUrlStore } from "../State/Properties/RootUrlStore"

export const DOOR_LOCKED = "The door is locked. You are not qualified to enter here."

let dialogueBox: UIWebsite|null
let helicopterGIF: UIWebsite|null
let coWebsite: CoWebsite|null

export async function openDialogueBox(checkpointId: string) {
    console.log("openDialogueBox")
    const root = rootUrlStore.getState();
    dialogueBox = await WA.ui.website.open({
        url:  root + `/dialogue-box/index.html?id=${checkpointId}`,
        visible: true,
        allowApi: true,
        allowPolicy: "",   // The list of feature policies allowed
        position: {
            vertical: "bottom",
            horizontal: "middle",
        },
        size: {            // Size on the UI (available units: px|em|%|cm|in|pc|pt|mm|ex|vw|vh|rem and others values auto|inherit)
            height: "120px",
            width: "650px",
        },
        margin: {              // Website margin (available units: px|em|%|cm|in|pc|pt|mm|ex|vw|vh|rem and others values auto|inherit)
            bottom: "70px",
        },
    })
}

export async function closeDialogueBox() {
    const localDialogueBox = dialogueBox;
    if (localDialogueBox) {
        await localDialogueBox.close();
        // Avoid race condition by using a reference instead of dialogueBox directly
        if (dialogueBox === localDialogueBox) {
            dialogueBox = null;
        }
    }
}

export async function openWebsite(url: string) {
    const root = rootUrlStore.getState();
    const finalUrl = isURL(url) ? url : `${root}/content/${url}`
    if (isURL(url) && mustOpenInNewTab(url)) {
        WA.nav.openTab(finalUrl)
    } else {
        coWebsite = await WA.nav.openCoWebSite(
            finalUrl,
            false,
            "accelerometer; autoplay; camera; encrypted-media; gyroscope; picture-in-picture",
            70,
            1,
            true,
            false
        )
    }
}

export async function closeWebsite() {
    const localCoWebsite = coWebsite;
    if (localCoWebsite) {
        console.log("coWebsite",coWebsite)
        await localCoWebsite.close();
        // Avoid race condition by using a reference instead of coWebsite directly
        if (coWebsite === localCoWebsite) {
            coWebsite = null;
        }
    }
}

export function openCheckpointBanner(nextCheckpointId: string) {
    console.log("Display banner of checkpoint", nextCheckpointId)

    if (nextCheckpointId === "-1") {
        // If there is no more checkpoints then all checkpoints have been passed!
        WA.ui.banner.openBanner({
            id: "onboarding-banner",
            text: "CONGRATULATIONS! YOU HAVE SUCCESSFULLY FINISHED THE ONBOARDING AND COMPLETED ALL CHECKPOINTS!",
            bgColor: "#3402F0",
            textColor: "#FFFFFF",
            closable: false,
            timeToClose: 120000
        });

        return;
    }
    
    // Search for the message to display depending on the player's checkpoint
    const checkpoint = checkpoints.find(c => c.id === nextCheckpointId)
    //const delayBeforeDisplayingNextCheckpoint = 30 * 1000

    if (checkpoint) {
        // FIXME: Find out why banners stack
        //setTimeout(() => {
            WA.ui.banner.openBanner({
                id: "onboarding-banner",
                text: `${checkpoint.title}: ${checkpoint.description}`,
                bgColor: "#3402F0",
                textColor: "#FFFFFF",
                closable: false,
                timeToClose: 120000
            });
        //}, delayBeforeDisplayingNextCheckpoint)
    }
}

export function openErrorBanner(message: string = DOOR_LOCKED) {
    console.log("Open error banner with message",message)
    WA.ui.banner.openBanner({
        id: "onboarding-banner",
        text: message,
        bgColor: "#FD4D26",
        textColor: "#FFFFFF",
        closable: false,
        timeToClose: 3000
    });
}

export function closeBanner() {
    WA.ui.banner.closeBanner()
}

export function displayChecklistButton() {
    const root = rootUrlStore.getState();

    WA.ui.actionBar.addButton({
        id: 'checklist-btn',
        type: 'action',
        imageSrc: `${root}/checklist-icon.svg`,
        toolTip: "Onboarding Checklist",
        callback: () => {
            WA.ui.modal.openModal({
                title: "Plan",
                src: `${root}/checklist/index.html`,
                allowApi: true,
                allow: "microphone; camera",
                position: "center",
            }, () => WA.ui.modal.closeModal())
        }
    });
}

export async function displayHelicopterGIF() {
    const root = rootUrlStore.getState();
    
    helicopterGIF = await WA.ui.website.open({
        url: `${root}/helicopter.gif`,
        visible: true,
        allowApi: false,
        allowPolicy: "",   // The list of feature policies allowed
        position: {
            vertical: "middle",
            horizontal: "middle",
        },
        size: {            // Size on the UI (available units: px|em|%|cm|in|pc|pt|mm|ex|vw|vh|rem and others values auto|inherit)
            height: "500px",
            width: "500px",
        },
    })
}

export async function removeHelicopterGIF() {
    if (helicopterGIF) {
        await helicopterGIF.close()
    }
}