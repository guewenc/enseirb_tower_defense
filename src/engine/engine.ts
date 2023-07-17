/**
 * @file engine.ts
 * @brief This file contains the implementation of the game engine functions.
 */

import { World } from "./../world/world";
import { Actor, getActorsByType } from "../actors/actors";
import { List, isEmpty } from "../common/list";

/**
 * The winner of the game.
 */
type Winner = "ENEMY" | "TOWER" | "NONE"

/**
 * @brief Check if the game is over.
 *
 * @param aWorld The current world state of the game.
 * @param actors The list of actors in the game.
 * @return The winner of the game.
 */
function gameIsOver(aWorld: World, actors: List<Actor>): Winner {
    if (isEmpty(getActorsByType(actors, "ENEMY")) && isEmpty(getActorsByType(actors, "SPAWNER")))
        return "TOWER";
    if (isEmpty(getActorsByType(actors, "GOAL")))
        return "ENEMY";
    return "NONE";
}

export {
    gameIsOver,
    Winner
};