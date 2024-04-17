import { AvatarComponent } from './AvatarComponent';
import { MessageComponent } from './MessageComponent';
import { CheckpointDescriptor } from '../../../src/Onboarding/Type/Checkpoints';

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

        // This event is triggered from the pagination logic (when the 'Close' button is clicked)
        document.addEventListener('destroy', async () => {
            await WA.player.state.saveVariable("closeDialogueBoxEvent", this.checkpoint, {
                public: false,
                persist: false,
                scope: "room",
            });

            // get current iframe ID
            const websiteId = WA.iframeId;
            if (websiteId) {
                const website = await WA.ui.website.getById(websiteId);
                website?.close()
            }
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