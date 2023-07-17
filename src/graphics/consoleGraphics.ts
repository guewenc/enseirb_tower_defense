/**
 * @file consoleGraphics.ts
 * @brief This file contains functions for displaying the game world in the console using ASCII characters.
*/

import { Actor, getActorsAtPos } from "../actors/actors";
import { List, cons, emptyList, head, isEmpty, listFoldR, tail } from "../common/list";
import { Vertex } from "../common/vertex";
import { World, getDimensionWorld } from "../world/world";
import { clearGrid, createNode } from "./htmlHandle";
import { Position, createPosition, getX, positionEquals } from "../common/position";
import { Winner, gameIsOver } from "../engine/engine";

/**
 * @brief Returns the index of a given position in a 1D array.
 *
 * @param worldSize The size of the world.
 * @return A function that calculates the index of a position.
 */
const posToIndexCur = (worldSize: Position) => (x: number, y: number) => y * (getX(worldSize) + 1) + x;

/**
 * @brief Returns the position following the given position.
 *
 * @param pos The position to get the next position for.
 * @param size The size of the world.
 * @return The next position.
 */
const nextPos = (pos: Position, size: Position) => pos.x >= size.x ? createPosition(0, pos.y + 1) : createPosition(pos.x + 1, pos.y);

/**
 * @brief Inserts a vertex in a list of vertices sorted by x position.
 *
 * @param list The list of vertices to insert into.
 * @param element The vertex to insert.
 * @return A new list with the vertex inserted in the correct position.
 */
function setVertical(list: List<Vertex>, element: Vertex): List<Vertex> {
    if (isEmpty(list))
        return cons(element, emptyList());
    if (head(list).pos.x > element.pos.x)
        return cons(head(list), setVertical(tail(list), element));
    return cons(element, list);
}

/**
 * @brief Inserts a vertex in a list of lists of vertices sorted by y position.
 *
 * @param list The list of lists of vertices to insert into.
 * @param element The vertex to insert.
 * @return A new list of lists with the vertex inserted in the correct position.
 */
function setElementAtPosInList(list: List<List<Vertex>>, element: Vertex): List<List<Vertex>> {
    if (isEmpty(list))
        return cons(cons(element, emptyList()), emptyList());
    if (head(head(list)).pos.y === element.pos.y)
        return cons(setVertical(head(list), element), tail(list));
    if (head(head(list)).pos.y > element.pos.y)
        return cons(setVertical(emptyList(), element), list);
    return cons(head(list), setElementAtPosInList(tail(list), element));
}

/**
 * @brief Builds a list of lists of vertices representing the graph of a world.
 *
 * @param aWorld The world to build the graph from.
 * @return A list of lists of vertices representing the graph of the world.
 */
function buildWorldList(aWorld: World): List<List<Vertex>> {
    return listFoldR((acc, elt) => setElementAtPosInList(acc, elt), <List<List<Vertex>>>emptyList(), aWorld.graph.vertexes);
}

/**
 * @brief Returns the character associated with the given actor type.
 *
 * @param anActor The actor to get the character for.
 * @return The character associated with the given actor type.
 */
function getActorChar(anActor: Actor): string {
    switch (anActor.name) {
        case "Remy with a Spoon":
            return "0";
        case "Hungry Remy with a Spoon":
            return "1";
        case "Remy Throwing Cheese":
            return "2";
        case "Gusteau with a Pan":
            return "3";
        case "Angry Gusteau with a Pan":
            return "4";
        case "Very Angry Gusteau with a Pan":
            return "5";
        case "Linguini":
            return "6";
        case "Marmite":
            return "7";
        case "Worktop":
            return "8";
        case "Hole":
            return "H";
        default:
            break;
    }
    return " ";
}

/**
 * @brief Returns a string representation of the world list with actor characters added.
 *
 * @param list The list of lists of vertices representing the world.
 * @param actors The list of actors to add to the world list.
 * @param isHtml A boolean indicating if the output is in HTML format.
 * @return A string representation of the world list with actor characters added.
 */
function addActorToWorldList(list: List<List<Vertex>>, actors: List<Actor>, isHtml: boolean): string {
    return listFoldR(function (acc, elt) {
        return acc + listFoldR(function (acc2, elt2) {
            const actorsAtPos = getActorsAtPos(actors, elt2.pos);
            if (isEmpty(actorsAtPos))
                return acc2 + (isHtml ? " " : "*");
            return acc2 + getActorChar(head(actorsAtPos));
        }, "", elt) + (isHtml ? "" : "\n");
    }, "", list);
}

/**
 * @brief Builds an HTML grid element representing the game state.
 *
 * @param gameString A string representation of the game state.
 * @param pos The position of the grid element.
 * @param size The size of the world.
 * @param grid The grid container element.
 * @param winner The winner of the game, if any.
 * @return The HTML grid element.
 */
function buildGridElement(gameString: string, pos: Position, size: Position, grid: HTMLDivElement, winner: Winner): HTMLDivElement {
    grid.appendChild(createNode(gameString, pos.x, pos.y, posToIndexCur(size), winner));
    if (positionEquals(pos, size))
        return grid;
    console.log(grid);
    return buildGridElement(gameString, nextPos(pos, size), size, grid, winner);
}

/**
 * @brief Prints the game state to the console or an HTML grid element.
 *
 * @param aWorld The world state.
 * @param actors The list of actors to add to the world list.
 */
function printGame(aWorld: World, actors: List<Actor>): void {
    let gridContainer = undefined;
    try {
        gridContainer = document.getElementById("grid-container");
    } catch (error) {
        console.log("Executing in console");
    }

    if (gridContainer === undefined || gridContainer === null)
        console.log(addActorToWorldList(buildWorldList(aWorld), actors, false));
    else {
        clearGrid();
        const worldSize = getDimensionWorld(aWorld);
        let grid = document.createElement("div");
        grid.classList.add("grid");
        grid.id = "grid";
        grid = buildGridElement(addActorToWorldList(buildWorldList(aWorld), actors, true), createPosition(0, 0), worldSize, grid, gameIsOver(aWorld, actors));
        gridContainer.appendChild(grid);
        document.documentElement.style.setProperty('--world-size', `${worldSize.x + 1}`);
    }
}

/**
 * @brief Prints the health of all actors in a list.
 *
 * @param actors The list of actors to print the health of.
 */
function printHealth(actors: List<Actor>): void {
    let logs = undefined;
    try {
        logs = document.getElementById("logs");
    } catch {
        console.log("Log in console");
    }
    const logsText = listFoldR((acc, actor) => acc + `Actor ${actor.id} health : ${actor.health}` + "\n", "", actors);

    if (logs === undefined || logs === null) {
        console.log(logsText);
    } else {
        logs.innerHTML = logsText;
    }
}

export {
    printGame,
    printHealth,
    buildWorldList
};