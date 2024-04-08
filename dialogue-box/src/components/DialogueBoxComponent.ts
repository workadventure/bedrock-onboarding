import { AvatarComponent } from './AvatarComponent';
import { MessageComponent } from './MessageComponent';
import { CheckpointDescriptor } from '../../../src/onboarding/checkpoints';
import { teleportJonas } from "../../../src/onboarding/tiles";
import { openWebsite } from "../../../src/onboarding/ui";
import { passCheckpoint } from "../../../src/onboarding/index"

interface DialogueBoxProps {
    checkpoint: CheckpointDescriptor;
}

export class DialogueBoxComponent implements DialogueBoxProps {
    checkpoint: CheckpointDescriptor;

    private dialogueContainer: HTMLDivElement;
    private avatarComponent: AvatarComponent;
    private messageComponent: MessageComponent;

    constructor(checkpoint: CheckpointDescriptor) {
        this.checkpoint = checkpoint;

        this.dialogueContainer = document.createElement('div');
        this.dialogueContainer.className = 'dialogue-box';

        if (this.checkpoint.npcName) {
            this.avatarComponent = new AvatarComponent(this.checkpoint.npcName, `NPC_${this.checkpoint.npcName}.png`);
        }
        
        this.messageComponent = new MessageComponent(this.checkpoint.message, !!this.checkpoint.url);

        this.setupDOM();

        // This event will be triggered from the pagination logic (when the 'Close' button is clicked)
        document.addEventListener('destroy', () => {
            this.dialogueContainer.remove();

            // If the NPC has a content to show after the dialogue box is closed, open the content
            if (this.checkpoint.url) {
                console.log("this.checkpoint.url",this.checkpoint.url)
                openWebsite(this.checkpoint.url)
            }

            // If it's Jonas, remove its area and teleport him
            if (this.checkpoint.npcName === "Jonas") {
                WA.room.area.delete(this.checkpoint.id)
                teleportJonas(this.checkpoint.coordinates.x, this.checkpoint.coordinates.y)
            }

            console.log("this.checkpoint.id",this.checkpoint.id)
            passCheckpoint(this.checkpoint.id)
        });
    }

    private setupDOM(): void {
        if (this.checkpoint.npcName) {
            const avatarContainer = this.avatarComponent.render();
            this.dialogueContainer.appendChild(avatarContainer);
        }
        
        const messageContainer = this.messageComponent.render();
        this.dialogueContainer.appendChild(messageContainer);
    }

    render(): HTMLElement {
        return this.dialogueContainer;
    }
}