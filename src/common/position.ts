/**
 * @file position.ts
 * @brief This file contains the implementation of the Position type and its related functions.
 */

/**
 * @brief A type that represents a position in 2D space, with an x and y coordinate.
 */
type Position = {
    x: number,
    y: number;
}

/**
 * @brief Returns a new Position object with the specified x and y coordinates.
 *
 * @param {number} x - The x coordinate for the new Position object.
 * @param {number} y - The y coordinate for the new Position object.
 * @returns {Position} A new Position object with the specified x and y coordinates.
 *
 * @example
 * // Create a new position object with coordinates (3, 5)
 * const position = createPosition(3, 5);
 *
 * // The position object should have x and y coordinates of 3 and 5, respectively
 * console.log(`Position: (${getX(position)}, ${getY(position)})`);
 */
const createPosition = (x: number, y: number): Position => ({ x, y });

/**
 * @brief Returns the x coordinate of the specified Position object.
 *
 * @param {Position} position - The Position object to get the x coordinate from.
 * @returns {number} The x coordinate of the specified Position object.
 *
 * @example
 * // Create a new position object with coordinates (3, 5)
 * const position = createPosition(3, 5);
 *
 * // The x coordinate of the position object should be 3
 * console.log(`Position x coordinate: ${getX(position)}`);
 */
const getX = (position: Position): number => position.x;

/**
 * @brief Returns the y coordinate of the specified Position object.
 *
 * @param {Position} position - The Position object to get the y coordinate from.
 * @returns {number} The y coordinate of the specified Position object.
 *
 * @example
 * // Create a new position object with coordinates (3, 5)
 * const position = createPosition(3, 5);
 *
 * // The y coordinate of the position object should be 5
 * console.log(`Position y coordinate: ${getY(position)}`);
 */
const getY = (position: Position): number => position.y;

/**
 * @brief Returns a new Position object with the same y coordinate as the specified Position object, but with a new x coordinate.
 *
 * @param {Position} position - The Position object to update with a new x coordinate.
 * @param {number} x - The new x coordinate for the Position object.
 * @returns {Position} A new Position object with the same y coordinate as the specified Position object, but with a new x coordinate.
 *
 * @example
 * // Create a new position object with coordinates (3, 5)
 * const position = createPosition(3, 5);
 *
 * // Update the x coordinate of the position object to 7
 * const updatedPosition = setPositionX(position, 7);
 *
 * // The updated position object should have coordinates (7, 5)
 * console.log(`Updated position: (${getX(updatedPosition)}, ${getY(updatedPosition)})`);
 */
const setPositionX = (position: Position, x: number): Position => createPosition(x, getY(position));

/**
 * @brief Returns a new Position object with the same x coordinate as the specified Position object, but with a new y coordinate.
 *
 * @param {Position} position - The Position object to update with a new y coordinate.
 * @param {number} y - The new y coordinate for the Position object.
 * @returns {Position} A new Position object with the same x coordinate as the specified Position object, but with a new y coordinate.
 *
 * @example
 * // Create a new position object with coordinates (3, 5)
 * const position = createPosition(3, 5);
 *
 * // Update the y coordinate of the position object to 9
 * const updatedPosition = setPositionY(position, 9);
 *
 * // The updated position object should have coordinates (3, 9)
 * console.log(`Updated position: (${getX(updatedPosition)}, ${getY(updatedPosition)})`);
 */
const setPositionY = (position: Position, y: number): Position => createPosition(getX(position), y);

/**
 * @brief Returns a new Position object with the x and y coordinates translated by the specified amounts.
 *
 * @param {Position} position - The original position to create a new position from.
 * @param {number} dx - The amount to translate the x coordinate by.
 * @param {number} dy - The amount to translate the y coordinate by.
 * @returns {Position} A new Position object with the x and y coordinates translated by the specified amounts.
 *
 * @example
 * // Define a starting position
 * const startingPosition = createPosition(3, 5);
 *
 * // Translate the position by (2, -1)
 * const translatedPosition = translatePosition(startingPosition, 2, -1);
 *
 * // The translated position should now be at coordinates (5, 4)
 * console.log(`Translated position: (${getX(translatedPosition)}, ${getY(translatedPosition)})`);
 */
const translatePosition = (position: Position, dx: number, dy: number): Position => {
    return createPosition(getX(position) + dx, getY(position) + dy);
};

/**
 * @brief Compares two Position objects to determine if they have the same x and y coordinates.
 *
 * @param p1 The first Position object to compare.
 * @param p2 The second Position object to compare.
 *
 * @return True if the x and y coordinates of both positions are equal, false otherwise.
 *
 * @example
 * // Create two position objects with coordinates (3, 5)
 * const pos1 = createPosition(3, 5);
 * const pos2 = createPosition(3, 5);
 *
 * // Test if the positions are equal
 * const equal = positionEquals(pos1, pos2); // true
 */
const positionEquals = (p1: Position, p2: Position): boolean => (p1.x === p2.x && p1.y === p2.y);

/**
 * @brief Calculates the Euclidean distance between two positions.
 *
 * This function takes two positions as input and returns the Euclidean distance between them.
 *
 * @param pos1 The first position.
 * @param pos2 The second position.
 * @return The Euclidean distance between `pos1` and `pos2`.
 */
function positionDistance(pos1: Position, pos2: Position): number {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

export {
    Position,
    createPosition,
    getX,
    getY,
    setPositionX,
    setPositionY,
    translatePosition,
    positionEquals,
    positionDistance
};