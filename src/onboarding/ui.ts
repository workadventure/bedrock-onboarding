/// <reference types="@workadventure/iframe-api-typings" />

import { CoWebsite, UIWebsite } from "@workadventure/iframe-api-typings";
import { checkpoints } from "./checkpoints";

let dialogueBox: UIWebsite|null
let coWebsite: CoWebsite|null
let root: string

WA.onInit().then(() => {
    const mapUrl = WA.room.mapURL
    root = mapUrl.substring(0, mapUrl.lastIndexOf("/"))
})

export async function openDialogueBox(checkpointId: string) {
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

export function closeDialogueBox() {
    dialogueBox?.close()
}

export async function openWebsite(url: string) {
    coWebsite = await WA.nav.openCoWebSite(url)
}

export function closeWebsite() {
    coWebsite?.close()
}

export function openCheckpointBanner(nextCheckpointId: string) {
    console.log("Display description of checkpoint", nextCheckpointId)

    // Search for the message to display depending on the player's checkpoint
    const checkpoint = checkpoints.find(c => c.id === nextCheckpointId)
    const delayBeforeDisplayingNextCheckpoint = 30 * 1000

    if (checkpoint) {
        setTimeout(() => {
            WA.ui.banner.openBanner({
                id: "onboarding-banner",
                text: `${checkpoint.title}: ${checkpoint.description}`,
                bgColor: "#3402F0",
                textColor: "#FFFFFF",
                closable: false,
                timeToClose: 120000
            });
        }, delayBeforeDisplayingNextCheckpoint)
    } else {
        // If there is no more checkpoints then all checkpoints have been passed!
        WA.ui.banner.openBanner({
            id: "onboarding-banner",
            text: "CONGRATULATIONS! YOU HAVE SUCCESSFULLY FINISHED THE ONBOARDING AND COMPLETED ALL CHECKPOINTS!",
            bgColor: "#3402F0",
            textColor: "#FFFFFF",
            closable: false,
            timeToClose: 120000
        });
      }
}

export function openBanner(message: string) {
    WA.ui.banner.openBanner({
        id: "onboarding-banner",
        text: message,
        bgColor: "#FD4D26",
        textColor: "#FFFFFF",
        closable: true,
        timeToClose: 3000
    });
}

export function closeBanner() {
    WA.ui.banner.closeBanner()
}

export function displayChecklistButton() {
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