/**
 * @file edge.ts
 * @brief This file contains the implementation of the Edge type and its related functions.
 */

import { Vertex, vertexEquals } from "./vertex";

/**
 * @typedef {Object} Edge
 * @property {number} weight - The weight of the edge.
 * @property {Vertex} vertex - The vertex connected by the edge.
 */
type Edge = {
    weight: number;
    vertex: Vertex;
};

/**
 * @brief Creates a new edge with the given weight and connected vertex.
 *
 * @param {number} w - The weight of the edge.
 * @param {Vertex} v - The vertex connected by the edge.
 * @return {Edge} Returns a new edge object.
 */
const createEdge = (w: number, v: Vertex): Edge => ({ weight: w, vertex: v });

/**
 * @brief Retrieves the vertex connected by the given edge.
 *
 * @param {Edge} e - The edge to retrieve the vertex from.
 * @return {Vertex} Returns the vertex connected by the given edge.
 */
const getVertex = (e: Edge): Vertex => e.vertex;

/**
 * @brief Retrieves the weight of the given edge.
 *
 * @param {Edge} e - The edge to retrieve the weight from.
 * @return {number} Returns the weight of the given edge.
 */
const getWeight = (e: Edge): number => e.weight;

/**
 * @brief Sets the weight of the given edge to the given value.
 *
 * @param {Edge} e - The edge to set the weight for.
 * @param {number} newW - The new weight to set.
 * @return {Edge} Returns the edge with the updated weight.
 */
const setWeight = (e: Edge, newW: number): Edge => ({ weight: newW, vertex: e.vertex });

/**
 * @brief Compares two edges to determine if they are equal.
 *
 * @param {Edge} e1 - The first edge to compare.
 * @param {Edge} e2 - The second edge to compare.
 * @return {boolean} Returns true if the two edges are equal, false otherwise.
 */
const edgeEquals = (e1: Edge, e2: Edge): boolean => {
    return e1.weight === e2.weight && vertexEquals(e1.vertex, e2.vertex);
};

export {
    Edge,
    createEdge,
    getVertex,
    getWeight,
    setWeight,
    edgeEquals
};