/**
 * @file world.ts
 * @brief This file contains the definition of the World type which represents the game world.
 */

import { createGraph, Graph } from "../common/graph";
import { List, appendList, emptyList, head, isEmpty, tail } from "../common/list";
import { createEdge } from "../common/edge";
import { Vertex, addEdge, createVertex } from "../common/vertex";
import { createPosition, Position, positionEquals } from "../common/position";

/**
 * @brief The World type defines the game world, consisting of a graph and a size.
 *
 * @typedef {Object} World
 * @property {Graph} graph - The graph representing the world.
 * @property {Position} size - The size of the world.
 */
type World = {
    graph: Graph;
    size: Position;
}

/**
 * @brief Creates a list of vertexes in the world recursively.
 *
 * @param {Position} currentPos - The current position.
 * @param {Position} size - The size of the world.
 * @returns {List<Vertex>} The list of vertexes in the world.
 */
function createVertexesRec(currentPos: Position, size: Position): List<Vertex> {
    if (positionEquals(currentPos, size))
        return appendList(emptyList(), createVertex(currentPos, emptyList()));
    const nextPos = currentPos.x >= size.x ? createPosition(0, currentPos.y + 1) : createPosition(currentPos.x + 1, currentPos.y);
    return appendList(createVertexesRec(nextPos, size), createVertex(currentPos, undefined));
}

/**
 * @brief Gets a vertex by position from a list of vertexes.
 *
 * @param {List<Vertex>} vertexes - The list of vertexes.
 * @param {Position} pos - The position of the vertex.
 * @returns {Vertex} The vertex with the specified position.
 */
function getVertexByPos(vertexes: List<Vertex>, pos: Position): Vertex {
    if (isEmpty(vertexes))
        return createVertex(createPosition(-1, -1), undefined);
    if (positionEquals(head(vertexes).pos, pos))
        return head(vertexes);
    return getVertexByPos(tail(vertexes), pos);
}

/**
 * @brief Adds edges to vertices in a graph to create a grid structure
 *
 * @param vertexes A list of vertices representing a grid
 * @param size The size of the grid
 * @return A new list of vertices with edges added between them
 */
function addEdgesToGraph(vertexes: List<Vertex>, size: Position): List<Vertex> {
    /**
     * @brief Recursively adds edges to vertices
     */
    function addEdgesToGraphRec(cursor: List<Vertex>): List<Vertex> {
        if (isEmpty(cursor))
            return emptyList();
        let vertex = head(cursor);
        if (vertex.pos.x > 0)
            vertex = addEdge(vertex, createEdge(1, getVertexByPos(vertexes, createPosition(vertex.pos.x - 1, vertex.pos.y))));
        if (vertex.pos.x < size.x)
            vertex = addEdge(vertex, createEdge(1, getVertexByPos(vertexes, createPosition(vertex.pos.x + 1, vertex.pos.y))));
        if (vertex.pos.y > 0)
            vertex = addEdge(vertex, createEdge(1, getVertexByPos(vertexes, createPosition(vertex.pos.x, vertex.pos.y - 1))));
        if (vertex.pos.y < size.y)
            vertex = addEdge(vertex, createEdge(1, getVertexByPos(vertexes, createPosition(vertex.pos.x, vertex.pos.y + 1))));
        return appendList(addEdgesToGraphRec(tail(cursor)), vertex);
    }
    return addEdgesToGraphRec(vertexes);
}

/**
 * @brief Creates a world of the given size
 *
 * @param size The size of the world
 * @return A new world of the given size
 */
function buildWorld(size: Position): World {
    return <World>{
        graph: createGraph(addEdgesToGraph(createVertexesRec(createPosition(0, 0), size), size), size.x * size.y),
        size: size
    };
}

/**
 * @brief Checks if a position is inside the world.
 *
 * @param {World} world The world to check the position in.
 * @param {Position} pos The position to check.
 * @returns {boolean} True if the position is inside the world, false otherwise.
 */
function isInWorld(world: World, pos: Position): boolean {
    return pos.x >= 0 && pos.x <= world.size.x && pos.y >= 0 && pos.y <= world.size.y;
}

/**
 * @brief Returns the dimensions of the world.
 *
 * @param {World} world The world to get the dimensions of.
 * @returns {Position} The dimensions of the world.
 */
function getDimensionWorld(world: World): Position {
    return world.size;
}

export {
    World,
    buildWorld,
    isInWorld,
    getDimensionWorld,
    getVertexByPos,
    addEdgesToGraph,
    createVertexesRec
};
