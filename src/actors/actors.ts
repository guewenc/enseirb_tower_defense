/**
 * @file actors.ts
 * @brief This file contains the implementation of the Actor type and its related functions.
 */

import { Position, createPosition, positionEquals, translatePosition } from "../common/position";
import { World } from "../world/world";
import { List, appendList, cons, emptyList, listLength, readListAt, listFoldR, isEmpty, head, tail, arrayToList, concatList } from "../common/list";
import { pathfinding } from "../common/graph";
import { AttackProposal, HealProposal, MoveProposal, PhaseAction, SpawnProposal } from "../engine/phases";
import {
    remyWithSpoon,
    hungryRemyWithSpoon,
    remyThrowingCheese,
    gusteauWithPan,
    angryGusteauWithPan,
    veryAngryGusteauWithPan,
    linguini,
    marmite,
    worktop,
    hole
} from "./actorsTemplate";

/**
 * @brief A unique identifier for an actor.
 */
let id_value: number = 0;

/**
 * @brief The type of an actor.
 */
type ActorType = "ENEMY" | "TOWER" | "SPAWNER" | "GOAL" | "WALL" | "UNKNOWN"

/**
 * @brief The actions an actor can perform during a phase.
 */
type ActorActions = {
    move?: PhaseAction<MoveProposal>;
    attack?: PhaseAction<AttackProposal>;
    spawn?: PhaseAction<SpawnProposal>;
    heal?: PhaseAction<HealProposal>;
}

/**
 * @brief An actor in the game world.
 */
type Actor = {
    readonly id: number;            /** The unique identifier of the actor. */
    readonly position: Position;    /** The position of the actor in the game world. */
    readonly type: ActorType;       /** The type of the actor. */
    readonly name: string;          /** The name of the actor. */
    readonly health: number;        /** The current health of the actor. */
    readonly maxHealth: number;     /** The maximum health of the actor. */
    readonly actions: ActorActions; /** The actions the actor can perform during a phase. */
}

/**
 * @brief A function that returns a new, unused identifier.
 *
 * @returns {number} A new identifier.
 */
const getNewId: () => number = () => id_value++;

/**
 * @brief Creates a new copy of an actor with a new, unused identifier.
 *
 * @param {Actor} anActor - The actor to be copied.
 * @returns {Actor} A new copy of the actor with a new, unused identifier.
 */
function copyNewActor(anActor: Actor): Actor {
    return <Actor>{
        ...anActor,
        id: getNewId(),
        actions: { ...anActor.actions }
    };
}

/**
 * @brief Creates a new copy of an actor.
 *
 * @param {Actor} anActor - The actor to be copied.
 * @returns {Actor} A new copy of the actor.
 */
function copyActor(anActor: Actor): Actor {
    return <Actor>{
        ...anActor,
        actions: { ...anActor.actions }
    };
}

/**
 * @brief Creates a strict copy of the input actor with a new health value.
 *
 * @param {Actor} anActor - The actor to copy.
 * @param {number} newHealth - The new health value for the copied actor.
 * @returns {Actor} A new copy of the actor with the specified health value.
 */
function setLifePoint(anActor: Actor, newHealth: number): Actor {
    return <Actor>{
        ...anActor,
        health: newHealth,
        actions: { ...anActor.actions }
    };
}

/**
 * @brief Creates a strict copy of the input actor with a new position value.
 *
 * @param {Actor} anActor - The actor to copy.
 * @param {Position} newPosition - The new position value for the copied actor.
 * @returns {Actor} A new copy of the actor with the specified position value.
 */
function setActorPosition(anActor: Actor, newPosition: Position): Actor {
    return <Actor>{
        ...anActor,
        position: newPosition,
        actions: { ...anActor.actions }
    };
}

/**
 * @brief Returns a copy of the first actor with the specified ID, if it exists in the input list.
 *
 * @param {List<Actor>} actors - The list of actors to search.
 * @param {number} anId - The ID of the actor to search for.
 * @returns {Actor|undefined} A new copy of the actor with the specified ID, or undefined if the ID is not found.
 */
function getActorById(actors: List<Actor>, anId: number): Actor | undefined {
    if (isEmpty(actors))
        return undefined;
    if (head(actors).id === anId)
        return copyActor(head(actors));
    return getActorById(tail(actors), anId);
}

/**
 * @brief Finds the actor with the same ID as `newActor` in `actors` and replaces it with `newActor`.
 *
 * @param {List<Actor>} actors - The list of actors to search.
 * @param {Actor} newActor - The actor to replace the existing actor with.
 * @returns {List<Actor>} A new list of actors with the specified actor replaced.
 */
function replaceActor(actors: List<Actor>, newActor: Actor): List<Actor> {
    if (isEmpty(actors))
        return emptyList();
    if (head(actors).id === newActor.id)
        return cons(newActor, tail(actors));
    return cons(head(actors), replaceActor(tail(actors), newActor));
}

/**
 * @brief Returns a list of actors with the same position as the input `pos`.
 *
 * @param {List<Actor>} actors - The list of actors to search.
 * @param {Position} pos - The position to search for.
 * @returns {List<Actor>} A new list of actors with the same position as the input position.
 */
function getActorsAtPos(actors: List<Actor>, pos: Position): List<Actor> {
    return listFoldR(function (acc: List<Actor>, elt: Actor) {
        if (positionEquals(elt.position, pos))
            return cons(elt, acc);
        return acc;
    }, emptyList(), actors);
}

/**
 * @brief Returns a list of actors that are in the 8 positions around the actor
 *
 * @param anActor The actor around which to search for neighbors
 * @param actors The list of actors to search through
 * @return {List<Actor>} The list of actors found around the specified actor
 */
function getNeighbors(anActor: Actor, actors: List<Actor>): List<Actor> {
    const listPos: List<Position> = arrayToList([
        translatePosition(anActor.position, -1, -1),
        translatePosition(anActor.position, -1, 0),
        translatePosition(anActor.position, -1, 1),
        translatePosition(anActor.position, 0, -1),
        translatePosition(anActor.position, 0, 1),
        translatePosition(anActor.position, 1, -1),
        translatePosition(anActor.position, 1, 0),
        translatePosition(anActor.position, 1, 1),
    ]);
    return listFoldR((acc: List<Actor>, pos) => concatList(acc, getActorsAtPos(actors, pos)), emptyList(), listPos);
}

/**
 * @brief Randomly choses one of the neighbors of an actor.
 *
 * @param anActor The actor whose neighbors to choose from.
 * @param actors A list of actors to check for neighbors.
 * @return The randomly chosen neighbor.
 */
function chooseNeighbor(anActor: Actor, actors: List<Actor>): Actor | undefined {
    const listNeigh: List<Actor> = getNeighbors(anActor, actors);
    if (isEmpty(listNeigh))
        return undefined;
    const len: number = listLength(listNeigh);
    const n: number = Math.floor(Math.random() * len);
    return readListAt(listNeigh, n);
}

/**
 * @brief Returns a list of goals for the enemies to approach.
 *
 * @param actors A list of actors to check for goals.
 * @return A list of goal actors.
 */
const getGoals = (actors: List<Actor>): List<Actor> => getActorsByType(actors, "GOAL");

/**
 * @brief Returns the Euclidean distance between actor1 and actor2.
 *
 * @param actor1 The first actor.
 * @param actor2 The second actor.
 * @return The Euclidean distance between actor1 and actor2.
 */
function actorDistance(actor1: Actor, actor2: Actor): number {
    return Math.sqrt(Math.pow(actor1.position.x - actor2.position.x, 2) + Math.pow(actor1.position.y - actor2.position.y, 2));
}

/**
 * @brief Returns the closest goal to an actor by euclidean distance
 *
 * This function takes an `Actor` and a list of `Actor`s as input and returns the `Actor`
 * from the list that is closest to the input `Actor` by euclidean distance.
 *
 * @param anActor The `Actor` for which to find the closest goal.
 * @param actors The list of `Actor`s to search for the closest goal.
 * @return The closest goal `Actor` to `anActor`.
 */
function chooseGoal(anActor: Actor, actors: List<Actor>): Actor | undefined {
    const goals = getGoals(actors);
    if (isEmpty(goals))
        return undefined;
    return listFoldR(function (acc, goal) {
        if (!acc)
            throw "Can't find goal";
        return actorDistance(anActor, goal) < actorDistance(anActor, acc) ? goal : acc;
    }, head(getGoals(actors)), getGoals(actors));
}

/**
 * @brief Get a list of actors of a certain type.
 *
 * @param actors A list of actors to filter
 * @param type The type of actors to filter for
 * @return A new list of actors containing only the actors of the specified type
 */
function getActorsByType(actors: List<Actor>, type: ActorType): List<Actor> {
    return listFoldR(function (acc: List<Actor>, actor) {
        if (actor.type === type)
            return appendList(acc, actor);
        return acc;
    }, emptyList(), actors);
}

/**
 * @brief Get all actors within a certain range of another actor
 *
 * @param actors A list of actors to filter
 * @param actor The actor to measure distance from
 * @param range The maximum distance from the specified actor to include in the result list
 * @return A new list of actors containing only the actors within the specified range of the specified actor
 */
function getAllActorsInRange(actors: List<Actor>, actor: Actor, range: number): List<Actor> {
    return listFoldR(function (acc: List<Actor>, elt) {
        if (actorDistance(elt, actor) <= range && elt.id !== actor.id)
            return appendList(acc, elt);
        return acc;
    }, emptyList(), actors);
}

/**
 * @brief Remove an actor with the specified ID from a list of actors
 *
 * @param actors The list of actors to remove an actor from
 * @param id The ID of the actor to remove
 * @return A new list of actors with the specified actor removed
 */
function removeActor(actors: List<Actor>, id: number): List<Actor> {
    if (isEmpty(actors))
        return emptyList();
    if (head(actors).id === id)
        return tail(actors);
    return cons(head(actors), removeActor(tail(actors), id));
}

/**
 * @brief Checks if a position is walkable by enemy actors.
 *
 * This function takes a list of actors and a position as input and returns whether the position is walkable by enemy actors.
 *
 * @param actors The list of actors to check against.
 * @param pos The position to check for walkability.
 * @return Whether the position is walkable by enemy actors.
 */
function isWalkableByEnemy(actors: List<Actor>, pos: Position) {
    return listFoldR((acc, actor) => actor.type === "ENEMY" || actor.type === "GOAL" ? acc : false, true, getActorsAtPos(actors, pos));
}

/**
 * @brief Gets the next position for an enemy actor to move towards.
 *
 * This function takes an `Actor`, a list of `Actor`s, and a `World` as input and returns the next position that the enemy actor should move towards in order to approach the closest goal.
 *
 * @param actor The `Actor` for which to determine the next position.
 * @param actors The list of `Actor`s to search for goals and neighbors.
 * @param world The `World` in which the `Actor`s exist.
 * @return The next position that the enemy actor should move towards.
 */
function getNextEnemyPos(actor: Actor, actors: List<Actor>, world: World): Position {
    const goal = chooseGoal(actor, actors);
    if (!goal)
        return actor.position;
    const path = pathfinding(actor.position, goal.position, world.graph, actors);
    if (isEmpty(path) || isEmpty(tail(path)))
        return actor.position;
    return head(tail(path)).pos;
}

/**
 * @brief Initializes the list of actors for the world. This function creates copies of predefined actors and returns them as a list.
 *
 * @param aWorld The world for which the actors need to be initialized.
 * @return A list of actors for the given world.
*/
function initializeActors(aWorld: World): List<Actor> {
    return arrayToList([
        copyNewActor(setActorPosition(worktop, createPosition(0,10))),
        copyNewActor(setActorPosition(worktop, createPosition(1,10))),
        copyNewActor(setActorPosition(worktop, createPosition(3,10))),
        copyNewActor(setActorPosition(worktop, createPosition(4,10))),
        copyNewActor(setActorPosition(worktop, createPosition(5,10))),
        copyNewActor(setActorPosition(worktop, createPosition(8,10))),
        copyNewActor(setActorPosition(worktop, createPosition(9,10))),
        copyNewActor(setActorPosition(worktop, createPosition(10,10))),
        copyNewActor(setActorPosition(marmite, createPosition(2,10))),
        copyNewActor(setActorPosition(marmite, createPosition(6,10))),
        copyNewActor(setActorPosition(marmite, createPosition(7,10))),

        copyNewActor(setActorPosition(worktop, createPosition(0,0))),
        copyNewActor(setActorPosition(worktop, createPosition(1,0))),
        copyNewActor(setActorPosition(worktop, createPosition(2,0))),
        copyNewActor(setActorPosition(worktop, createPosition(3,0))),
        copyNewActor(setActorPosition(worktop, createPosition(5,0))),
        copyNewActor(setActorPosition(worktop, createPosition(7,0))),
        copyNewActor(setActorPosition(worktop, createPosition(9,0))),
        copyNewActor(setActorPosition(worktop, createPosition(10,0))),
        copyNewActor(setActorPosition(marmite, createPosition(4,0))),
        copyNewActor(setActorPosition(marmite, createPosition(6,0))),
        copyNewActor(setActorPosition(marmite, createPosition(8,0))),

        copyNewActor(setActorPosition(hole, createPosition(0, 5))),

        copyNewActor(setActorPosition(remyWithSpoon, createPosition(0, 5))),
        copyNewActor(setActorPosition(remyWithSpoon, createPosition(0, 4))),
        copyNewActor(setActorPosition(remyWithSpoon, createPosition(0, 6))),
        copyNewActor(setActorPosition(remyThrowingCheese, createPosition(1, 7))),
        copyNewActor(setActorPosition(remyThrowingCheese, createPosition(1, 3))),

        copyNewActor(setActorPosition(gusteauWithPan, createPosition(5,5))),
        copyNewActor(setActorPosition(gusteauWithPan, createPosition(5,4))),
        copyNewActor(setActorPosition(gusteauWithPan, createPosition(5,6))),
        copyNewActor(setActorPosition(gusteauWithPan, createPosition(6,7))),
        copyNewActor(setActorPosition(gusteauWithPan, createPosition(6,3))),
        copyNewActor(setActorPosition(gusteauWithPan, createPosition(9,2))),
        copyNewActor(setActorPosition(gusteauWithPan, createPosition(9,8))),

        copyNewActor(setActorPosition(linguini, createPosition(8,5))),
    ]);
}

export {
    ActorType,
    ActorActions,
    Actor,
    copyNewActor,
    copyActor,
    setLifePoint,
    setActorPosition,
    getActorById,
    replaceActor,
    getActorsAtPos,
    getNeighbors,
    chooseNeighbor,
    getGoals,
    actorDistance,
    chooseGoal,
    getActorsByType,
    initializeActors,
    removeActor,
    isWalkableByEnemy,
    getAllActorsInRange,
    getNextEnemyPos
};