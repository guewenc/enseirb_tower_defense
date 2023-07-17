import { Position, positionEquals } from "../common/position";
import { Edge } from "./edge";
import { List, appendList, head, isEmpty, tail } from "./list";

/**
 * A graph vertex, represented by a unique identifier (id) and a position.
 * @typedef {Object} Vertex
 * @property {number} id - The unique identifier of the vertex.
 * @property {Position} pos - The position of the vertex.
 */
type Vertex = {
    pos: Position;
    adj: List<Edge>;
};

/**
 * @brief Creates a vertex with a given ID and position.
 *
 * @param id The ID of the vertex.
 * @param x The x coordinate of the position of the vertex.
 * @param y The y coordinate of the position of the vertex.
 * @return Returns the created vertex.
 */
const createVertex = (pos: Position, adj: List<Edge>): Vertex => {
    return { pos: pos, adj: adj };
};

/**
 * @brief Returns the position of a given vertex.
 *
 * @param v The vertex to get the position from.
 * @return The position of the vertex.
 */
const getPos = (v: Vertex): Position => v.pos;

/**
 * @brief Set the position of a vertex.
 *
 * @param v The vertex to modify.
 * @param x The x-coordinate of the new position.
 * @param y The y-coordinate of the new position.
 * @return Returns a new vertex with the updated position.
 */
const setPos = (v: Vertex, pos: Position): Vertex => ({ pos: pos, adj: v.adj });

/**
 * @brief Checks whether two vertices are equal by comparing their IDs and positions.
 *
 * @param v1 The first vertex to compare.
 * @param v2 The second vertex to compare.
 * @return Returns true if the vertices have the same ID and position, false otherwise.
 */
const vertexEquals = (v1: Vertex, v2: Vertex): boolean => {
    return positionEquals(v1.pos, v2.pos);
};

/**
 * @brief A function that adds an edge to a vertex's adjacency list.
 *
 * @param {Vertex} vertex The vertex to which the edge will be added.
 * @param {Edge} edge The edge to be added to the vertex's adjacency list.
 * @return {Vertex} Returns a new vertex with the edge added to its adjacency list.
 */
const addEdge = (vertex: Vertex, edge: Edge): Vertex => ({ ...vertex, adj: appendList(vertex.adj, edge) });

/**
 * @brief A function that retrieves a vertex from a list of vertices based on its position.
 *
 * This function will search through the list of vertices to find the vertex whose position matches the given position.
 * If no such vertex is found, an error will be thrown.
 *
 * @param {List<Vertex>} vertexes The list of vertices to search through.
 * @param {Position} pos The position of the vertex to retrieve.
 * @return {Vertex} Returns the vertex whose position matches the given position.
 * @throws {string} Throws an error if no vertex is found with the given position.
 */
function getVertexByPos(vertexes: List<Vertex>, pos: Position): Vertex {
    if (isEmpty(vertexes))
        throw `Can't find vertex at ${pos.x} ${pos.y}`;
    if (positionEquals(head(vertexes).pos, pos))
        return head(vertexes);
    return getVertexByPos(tail(vertexes), pos);
}

export {
    Vertex,
    createVertex,
    getPos,
    setPos,
    vertexEquals,
    addEdge,
    getVertexByPos
};