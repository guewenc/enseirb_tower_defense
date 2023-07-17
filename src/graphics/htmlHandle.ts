/**
 * @file htmlHandle.ts
 * @brief This file contains functions for handling the images used in the game.
*/

import { Winner } from "../engine/engine";


/**
 * @brief Removes the grid element from the HTML document.
*/
function clearGrid() {
    document.getElementById("grid")?.remove();
}

/**
 * @brief Creates an HTML grid node based on the contents of a given cell.
 *
 * @param gridList A string representation of the game state.
 * @param x The x-coordinate of the cell.
 * @param y The y-coordinate of the cell.
 * @param posToIndex A function to convert 2D coordinates to a 1D index.
 * @param winner The winner of the game, if any.
 * @return The HTML grid node.
*/
function createNode(gridList: string, x: number, y: number, posToIndex: (x: number, y: number) => number, winner: Winner) {
    const node = document.createElement("div");
    const enemyString = winner === "ENEMY" ? "goal_win" : "remy";
    switch (gridList[posToIndex(x, y)]) {
        case "0":
            node.classList.add("RS");
            break;
        case "1":
            node.classList.add("HRS");
            break;
        case "2":
            node.classList.add("RTC");
            break;
        case "3":
            node.classList.add("GP");
            break;
        case "4":
            node.classList.add("AGP");
            break;
        case "5":
            node.classList.add("VAGP");
            break;
        case "6":
            node.classList.add("L");
            break;
        case "7":
            node.classList.add("M");
            break;
        case "8":
            node.classList.add("W");
            break;
        case "H":
            node.classList.add("H");
            break;

        default:
            break;
    }

    node.classList.add("box");
    return node;
}

export {
    clearGrid,
    createNode
};