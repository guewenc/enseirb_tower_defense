/**
 * @file graph.ts
 * @brief This file defines the Graph type and related functions for creating and manipulating graphs.
 */

import { Actor, isWalkableByEnemy } from "../actors/actors";
import { Position, createPosition, positionDistance, positionEquals } from "../common/position";
import { List, isEmpty, emptyList, appendList, head, tail, listFoldR, cons } from "./list";
import { Vertex, getVertexByPos } from "./vertex";

/**
 * @brief A type that represents a graph.
 *
 * @property vertexes A list of vertices in the graph.
 * @property n The number of vertices in the graph.
 * @property adj A list of adjacency lists, where the i-th list contains all edges that start from vertex i.
 */
type Graph = {
    vertexes: List<Vertex>;
    n: number;
};

type Node = {
    vertex: Vertex;
    parent: Node | undefined;
    distance: number;
    score: number;
};

/**
 * @brief Checks if a graph is empty.
 *
 * A graph is considered empty if it has no vertexes or edges.
 *
 * @param {Graph} G The graph to check.
 * @return {boolean} Returns true if the graph is empty, false otherwise.
 */
function isEmptyGraph(G: Graph): boolean {
    return G.n === 0 && isEmpty(G.vertexes);
}

/**
 * @brief Creates an empty graph with no vertexes or edges.
 *
 * The resulting graph will have size 0 and empty vertex and adjacency lists.
 *
 * @return {Graph} Returns an empty graph.
 */
function createEmptyGraph(): Graph {
    return { vertexes: emptyList(), n: 0 };
}

/********************************************************************************
 * All functions return new graphs (no side effects in functional programming). *
*********************************************************************************/

/**
 * @brief Creates a graph from an adjacency matrix.
 *
 * @param {List<Vertex>} v The list of vertexes in the graph.
 * @param {number} n The size of the graph.
 * @return {Graph} Returns the created graph.
 */
function createGraph(v: List<Vertex>, n: number): Graph {
    return { vertexes: v, n: n };
}

/**
 * @brief Creates a new node object to be used in pathfinding.
 *
 * @param {Node | undefined} parent - The parent node of the new node, or undefined if this is the first node.
 * @param {Vertex} vertex - The vertex associated with this node.
 * @param {Position} dst - The destination position for the pathfinding.
 * @return {Node} Returns a new node object.
 */
function makeNode(parent: Node | undefined, vertex: Vertex, dst: Position): Node {
    let distance;
    if (parent)
        distance = parent.distance + 1;
    else
        distance = 0;
    return <Node>{ parent: parent, vertex: vertex, distance: distance, score: distance + positionDistance(vertex.pos, dst) };
}

/**
 * @brief Extracts the node with the smallest score from a list of nodes.
 *
 * @param {List<Node>} nodes - The list of nodes to search.
 * @return {Node} Returns the node with the smallest score.
 */
function extractClosestNode(nodes: List<Node>): Node {
    return listFoldR(function (acc, node) {
        if (node.score < acc.score)
            return node;
        return acc;
    }, head(nodes), nodes);
}

/**
 * @brief Reconstructs the path from the start node to the end node.
 *
 * @param {Node} node - The end node of the path.
 * @return {List<Vertex>} Returns a list of vertices representing the path from start to end.
 */
function reconstructPath(node: Node): List<Vertex> {
    if (!node.parent)
        return cons(node.vertex, emptyList());
    return appendList(reconstructPath(node.parent), node.vertex);
}

/**
 * @brief Checks if a node is in a list of nodes.
 *
 * @param {List<Node>} nodes - The list of nodes to search.
 * @param {Node} node - The node to check for.
 * @return {boolean} Returns true if the node is in the list, false otherwise.
 */
function isNodeInList(nodes: List<Node>, node: Node): boolean {
    if (isEmpty(nodes))
        return false;
    if (positionEquals(head(nodes).vertex.pos, node.vertex.pos))
        return true;
    return isNodeInList(tail(nodes), node);
}

/**
 * @brief Updates a node in a list of nodes with a new node.
 *
 * @param {List<Node>} nodes - The list of nodes to search.
 * @param {Node} node - The node to update.
 * @return {List<Node>} Returns the updated list of nodes.
 */
function updateNodeInList(nodes: List<Node>, node: Node): List<Node> {
    if (isEmpty(nodes))
        throw "Unexpected error";
    if (positionEquals(head(nodes).vertex.pos, node.vertex.pos))
        if (node.distance < head(nodes).distance)
            return cons(node, tail(nodes));
        else
            return nodes;
    return cons(head(nodes), updateNodeInList(tail(nodes), node));
}

/**
 * @brief Removes a node from a list of nodes.
 *
 * @param {List<Node>} nodes - The list of nodes to search.
 * @param {Node} node - The node to remove.
 * @return {List<Node>} Returns the updated list of nodes.
 */
function removeNodeFromList(nodes: List<Node>, node: Node): List<Node> {
    if (isEmpty(nodes))
        return emptyList();
    if (positionEquals(head(nodes).vertex.pos, node.vertex.pos))
        return tail(nodes);
    return cons(head(nodes), removeNodeFromList(tail(nodes), node));
}

/**
 * @brief Recursively performs A* pathfinding algorithm.
 *
 * This function implements the A* algorithm for finding the shortest path from the source position to the destination position in a graph.
 * It uses a list of nodes representing the open list, a list of nodes representing the closed list, the destination position, the graph, and a list of actors.
 * It returns a list of vertices representing the shortest path from the source position to the destination position, if it exists.
 *
 * @param {List<Node>} openList The list of nodes representing the open list.
 * @param {List<Node>} closedList The list of nodes representing the closed list.
 * @param {Position} dst The destination position.
 * @param {Graph} G The graph to search for the shortest path.
 * @param {List<Actor>} actors The list of actors in the game.
 * @return {List<Vertex>} Returns a list of vertices representing the shortest path from the source position to the destination position, if it exists.
 */
function pathfindingRec(openList: List<Node>, closedList: List<Node>, dst: Position, G: Graph, actors: List<Actor>): List<Vertex> {
    if (isEmpty(openList))
        return emptyList();
    const current = extractClosestNode(openList);
    openList = removeNodeFromList(openList, current);
    if (positionEquals(current.vertex.pos, dst))
        return reconstructPath(current);
    closedList = appendList(closedList, current);
    [openList, closedList] = listFoldR(function ([openList, closedList], edge) {
        const neighbor = makeNode(current, getVertexByPos(G.vertexes, edge.vertex.pos), dst);
        if (isNodeInList(closedList, neighbor))
            return [openList, closedList];
        if (!isWalkableByEnemy(actors, neighbor.vertex.pos))
            return [openList, cons(neighbor, closedList)];
        if (!isNodeInList(openList, neighbor))
            return [appendList(openList, neighbor), closedList];
        return [updateNodeInList(openList, neighbor), closedList];
    }, [openList, closedList], current.vertex.adj);
    return pathfindingRec(openList, closedList, dst, G, actors);
}

/**
 * @brief Finds the shortest path in a graph from a source position to a destination position.
 *
 * This function finds the shortest path from a source position to a destination position in a graph using the A* algorithm.
 * It takes as input the source position, the destination position, the graph, and a list of actors in the game.
 * It returns a list of vertices representing the shortest path from the source position to the destination position, if it exists.
 *
 * @param {Position} src The source position.
 * @param {Position} dst The destination position.
 * @param {Graph} G The graph to search for the shortest path.
 * @param {List<Actor>} actors The list of actors in the game.
 * @return {List<Vertex>} Returns a list of vertices representing the shortest path from the source position to the destination position, if it exists.
 */
function pathfinding(src: Position, dst: Position, G: Graph, actors: List<Actor>): List<Vertex> {
    const openList: List<Node> = cons(makeNode(undefined, getVertexByPos(G.vertexes, src), dst), emptyList());
    const closedList: List<Node> = emptyList();
    return pathfindingRec(openList, closedList, dst, G, actors);
}

export {
    Graph,
    isEmptyGraph,
    createEmptyGraph,
    createGraph,
    pathfinding,
    Node,
    makeNode,
    extractClosestNode,
    reconstructPath,
    isNodeInList,
    updateNodeInList,
    removeNodeFromList,
    pathfindingRec
};