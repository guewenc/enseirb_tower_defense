import { buildWorld } from "./world/world";
import { listFoldR, listMap } from "./common/list";
import { initializeActors } from "./actors/actors";
import { computePhases } from "./engine/phases";
import { gameIsOver } from "./engine/engine";
import { createPosition } from "./common/position";
import { printGame, printHealth } from "./graphics/consoleGraphics";

/**
 * @brief A function that waits for a given number of milliseconds before resolving.
 *
 * @param {number} ms The number of milliseconds to wait.
 * @return {Promise} A promise that resolves after the given number of milliseconds.
 */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * @brief The main game loop.
 *
 * The main function that runs the game loop, updating the game state and actors based on the computed phases until the game is over.
 */
async function main() {
    // Build the world and initialize the actors
    let world = buildWorld(createPosition(10, 10));
    let actors = initializeActors(world);
    const phases = computePhases(world, actors);

    // Print the initial game state
    printGame(world, actors);

    // Loop until the game is over
    while (gameIsOver(world, actors) === "NONE") {
        // Wait for a second before processing the next step
        await sleep(300);

        // Process the current phase for each actor
        [world, actors] = listFoldR(([aWorld, actors], aPhase) => {
            // Generate proposals for each actor based on the current phase
            const proposals = listMap((anActor) => anActor.actions[aPhase.funcName]?.(anActor, aWorld, actors), actors);

            // Resolve the proposals using the phase's resolver function
            return aPhase.resolver(aWorld, actors, proposals);
        }, [world, actors], phases);

        // Print the updated game state and actors' health
        printGame(world, actors);
        printHealth(actors);
    }
}

main();