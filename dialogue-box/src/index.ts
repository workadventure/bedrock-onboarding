import { DialogueBoxComponent } from './components/DialogueBoxComponent';
import { CheckpointDescriptor, checkpoints } from '../../src/onboarding/checkpoints';

console.info('"Dialogue Box" script started successfully')

let currentCheckpoint: CheckpointDescriptor|undefined

async function process() {
  const url = new URL(window.location.toString())
  const checkpointId = url.searchParams.get("id")

  currentCheckpoint = checkpoints.find(c => c.id === checkpointId)

  if (currentCheckpoint && currentCheckpoint.message) {

    const dialogueBoxComponent = new DialogueBoxComponent(currentCheckpoint);

    if (appElement) {
      appElement.appendChild(dialogueBoxComponent.render());
    } else {
      console.error("Element with ID 'app' not found.");
    }
  } else {
    console.error("Undefined NPC data");
  }
}

const appElement = document.getElementById('app');

// Why this weird syntax ?
// Flexibility: Works well whether the script is in the `<head>` or `<body>`.
// Efficiency: Avoids setting up unnecessary event listeners if the DOM is already loaded.
// Robustness: Handles both scenarios (loading or loaded) to prevent race conditions.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", process)
} else {
  process()
}
