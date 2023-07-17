import { describe, expect, test } from '@jest/globals';

import { pathfindingRec, Graph, createGraph, isEmptyGraph, createEmptyGraph, pathfinding, Node, makeNode, extractClosestNode, reconstructPath, isNodeInList, updateNodeInList, removeNodeFromList } from '../src/common/graph';
import { List, emptyList, cons, listEquals, readListAt, appendList, nil } from '../src/common/list';
import { Edge, edgeEquals } from '../src/common/edge';
import { Vertex, addEdge, createVertex } from "../src/common/vertex";
import { createPosition, Position } from '../src/common/position';
import { buildWorld, World } from '../src/world/world';
import { initializeActors, Actor } from '../src/actors/actors';

describe("Graph", () => {
    describe('isEmptyGraph', () => {
        test('returns true for an empty graph', () => {
            const G: Graph = createEmptyGraph();
            expect(isEmptyGraph(G)).toBe(true);
        });

        test('returns false for a non-empty graph', () => {
            const V1 = createVertex({ x: 0, y: 0 }, emptyList());
            const V2 = createVertex({ x: 1, y: 1 }, emptyList());
            const G: Graph = { vertexes: cons(V1, cons(V2, emptyList())), n: 2 };
            expect(isEmptyGraph(G)).toBe(false);
        });
    });

    describe('createEmptyGraph', () => {
        test('returns an empty graph', () => {
            const G: Graph = createEmptyGraph();
            expect(G.vertexes).toEqual(emptyList());
            expect(G.n).toBe(0);
        });
    });

    describe('pathfinding', () => {
        test("Uninplemented", () => {
            const v1: Vertex = { pos: { x: 0, y: 0 }, adj: emptyList() };
            const v2: Vertex = { pos: { x: 8, y: 8 }, adj: emptyList() };
            const size : Position = createPosition(10, 10);
            const w : World = buildWorld(size);
            const l : List<Actor> = initializeActors(buildWorld(size));
            const path : List<Vertex> = pathfinding(v1.pos, v2.pos, w.graph, l);
            expect(pathfindingRec(emptyList(), emptyList(), createPosition(1, 1), w.graph, l)).toEqual(emptyList());
            //pathfinding(v1.pos, v2.pos, G, nil);
            /*
            expect(() => {
                pathfinding(v1, v2, G);
            }).toThrow("Uninplemented");*/
        });
    });

    describe('makeNode', () => {
        const v1: Vertex = { pos: { x: 0, y: 0 }, adj: emptyList() };
        const v2: Vertex = { pos: { x: 1, y: 1 }, adj: emptyList() };
        it('should returns a Node', () => {
            const n : Node = {
                vertex : v1,
                distance : 10,
                score : 10,
                parent : undefined,
            };
            const n2 : Node = makeNode(n, v2, createPosition(2, 2));
            expect(n2.parent).toEqual(n);
            expect(n2.distance).toBeGreaterThan(0);
            const n3 : Node = makeNode(undefined, v2, createPosition(2, 2));
            expect(n3.distance).toBe(0);
            expect(n3.parent).toBe(undefined);
        });
    });

    describe('extractClosestNode', () => {
        it('should return the closest node of a list', () => {
            const n1 : Node = {
                vertex : { pos: { x: 0, y: 0 }, adj: emptyList() },
                distance : 10,
                score : 10,
                parent : undefined,
            };
            const n2 : Node = {
                vertex : { pos: { x: 1, y: 0 }, adj: emptyList() },
                distance : 10,
                score : 2,
                parent : n1,
            };
            const n3 : Node = {
                vertex : { pos: { x: 0, y: 1 }, adj: emptyList() },
                distance : 10,
                score : 14,
                parent : n2,
            };
            const n4 : Node = {
                vertex : { pos: { x: 1, y: 1 }, adj: emptyList() },
                distance : 10,
                score : 20,
                parent : n3,
            };
            const l : List<Node> = cons(n1, cons(n2, cons(n3, cons(n4, nil))));
            expect(extractClosestNode(l)).toEqual(n2);
        });    
    });

    describe('reconstructPath', () => {
        it('should return the path', () => {
            const n1 : Node = {
                vertex : { pos: { x: 0, y: 0 }, adj: emptyList() },
                distance : 10,
                score : 10,
                parent : undefined,
            };
            const n2 : Node = {
                vertex : { pos: { x: 1, y: 0 }, adj: emptyList() },
                distance : 10,
                score : 2,
                parent : n1,
            };
            const n3 : Node = {
                vertex : { pos: { x: 0, y: 1 }, adj: emptyList() },
                distance : 10,
                score : 14,
                parent : n2,
            };
            const n4 : Node = {
                vertex : { pos: { x: 1, y: 1 }, adj: emptyList() },
                distance : 10,
                score : 20,
                parent : n3,
            };
            const l : List<Vertex> = reconstructPath(n4);
            const l1 : List<Vertex> = cons(n1.vertex, cons(n2.vertex, cons(n3.vertex, cons(n4.vertex, nil))));
            expect(l).toEqual(l1);
        });
    });

    describe('isNodeInList', () => {
        it('should returns true if the node is in the list', () => {
            const n1 : Node = {
                vertex : { pos: { x: 0, y: 0 }, adj: emptyList() },
                distance : 10,
                score : 10,
                parent : undefined,
            };
            const n2 : Node = {
                vertex : { pos: { x: 1, y: 0 }, adj: emptyList() },
                distance : 10,
                score : 2,
                parent : n1,
            };
            const n3 : Node = {
                vertex : { pos: { x: 0, y: 1 }, adj: emptyList() },
                distance : 10,
                score : 14,
                parent : n2,
            };
            const n4 : Node = {
                vertex : { pos: { x: 1, y: 1 }, adj: emptyList() },
                distance : 10,
                score : 20,
                parent : n3,
            };
            const l : List<Node> = cons(n1, cons(n2, cons(n3, cons(n4, nil))));
            expect(isNodeInList(l, n4)).toBeTruthy();
        });

        it('should returns false if the node is not in the list', () => {
            const n1 : Node = {
                vertex : { pos: { x: 0, y: 0 }, adj: emptyList() },
                distance : 10,
                score : 10,
                parent : undefined,
            };
            const n2 : Node = {
                vertex : { pos: { x: 1, y: 0 }, adj: emptyList() },
                distance : 10,
                score : 2,
                parent : n1,
            };
            const n3 : Node = {
                vertex : { pos: { x: 0, y: 1 }, adj: emptyList() },
                distance : 10,
                score : 14,
                parent : n2,
            };
            const n4 : Node = {
                vertex : { pos: { x: 1, y: 1 }, adj: emptyList() },
                distance : 10,
                score : 20,
                parent : n3,
            };
            const l : List<Node> = cons(n1, cons(n2, cons(n3, nil)));
            expect(isNodeInList(l, n4)).toBeFalsy();
        });
    });

    describe('updateNodeInList', () => {
        it('should throw an error if the node is not in the list', () => {
            const n1 : Node = {
                vertex : { pos: { x: 0, y: 0 }, adj: emptyList() },
                distance : 10,
                score : 10,
                parent : undefined,
            };
            const n2 : Node = {
                vertex : { pos: { x: 1, y: 0 }, adj: emptyList() },
                distance : 10,
                score : 2,
                parent : n1,
            };
            const n3 : Node = {
                vertex : { pos: { x: 0, y: 1 }, adj: emptyList() },
                distance : 10,
                score : 14,
                parent : n2,
            };
            const n4 : Node = {
                vertex : { pos: { x: 1, y: 1 }, adj: emptyList() },
                distance : 10,
                score : 20,
                parent : n3,
            };
            const l : List<Node> = cons(n1, cons(n2, cons(n3, nil)));
            expect(() => {
                updateNodeInList(l, n4);
            }).toThrow("Unexpected error");
        });

        it('should not change the list if the distance of the node is greater', () => {
            const n1 : Node = {
                vertex : { pos: { x: 0, y: 0 }, adj: emptyList() },
                distance : 10,
                score : 10,
                parent : undefined,
            };
            const n2 : Node = {
                vertex : { pos: { x: 1, y: 0 }, adj: emptyList() },
                distance : 10,
                score : 2,
                parent : n1,
            };
            const n3 : Node = {
                vertex : { pos: { x: 0, y: 1 }, adj: emptyList() },
                distance : 10,
                score : 14,
                parent : n2,
            };
            const n4 : Node = {
                vertex : { pos: { x: 1, y: 1 }, adj: emptyList() },
                distance : 10,
                score : 20,
                parent : n3,
            };
            const n5 : Node = {
                vertex : { pos: { x: 1, y: 1 }, adj: emptyList() },
                distance : 11,
                score : 20,
                parent : n3,
            };
            const l : List<Node> = cons(n1, cons(n2, cons(n3, cons(n4, nil))));
            expect(updateNodeInList(l, n5)).toEqual(l);
        });

        it('should update the list if the distance of the node is lower', () => {
            const n1 : Node = {
                vertex : { pos: { x: 0, y: 0 }, adj: emptyList() },
                distance : 10,
                score : 10,
                parent : undefined,
            };
            const n2 : Node = {
                vertex : { pos: { x: 1, y: 0 }, adj: emptyList() },
                distance : 10,
                score : 2,
                parent : n1,
            };
            const n3 : Node = {
                vertex : { pos: { x: 0, y: 1 }, adj: emptyList() },
                distance : 10,
                score : 14,
                parent : n2,
            };
            const n4 : Node = {
                vertex : { pos: { x: 1, y: 1 }, adj: emptyList() },
                distance : 10,
                score : 20,
                parent : n3,
            };
            const n5 : Node = {
                vertex : { pos: { x: 1, y: 1 }, adj: emptyList() },
                distance : 9,
                score : 20,
                parent : n3,
            };
            const l : List<Node> = cons(n1, cons(n2, cons(n3, cons(n4, nil))));
            const l2 : List<Node> = cons(n1, cons(n2, cons(n3, cons(n5, nil))));
            expect(updateNodeInList(l, n5)).toEqual(l2);
        });

        describe('removeNodeFromList', () => {
            it('should return the same list if the node is not in the list', () => {
                const n1 : Node = {
                    vertex : { pos: { x: 0, y: 0 }, adj: emptyList() },
                    distance : 10,
                    score : 10,
                    parent : undefined,
                };
                const n2 : Node = {
                    vertex : { pos: { x: 1, y: 0 }, adj: emptyList() },
                    distance : 10,
                    score : 2,
                    parent : n1,
                };
                const n3 : Node = {
                    vertex : { pos: { x: 0, y: 1 }, adj: emptyList() },
                    distance : 10,
                    score : 14,
                    parent : n2,
                };
                const n4 : Node = {
                    vertex : { pos: { x: 1, y: 1 }, adj: emptyList() },
                    distance : 10,
                    score : 20,
                    parent : n3,
                };
                const n5 : Node = {
                    vertex : { pos: { x: 13, y: 1 }, adj: emptyList() },
                    distance : 9,
                    score : 20,
                    parent : n3,
                };
                const l : List<Node> = cons(n1, cons(n2, cons(n3, cons(n4, nil))));
                expect(removeNodeFromList(l, n5)).toEqual(l);
            });

            it('should returns the list without the node', () => {
                const n1 : Node = {
                    vertex : { pos: { x: 0, y: 0 }, adj: emptyList() },
                    distance : 10,
                    score : 10,
                    parent : undefined,
                };
                const n2 : Node = {
                    vertex : { pos: { x: 1, y: 0 }, adj: emptyList() },
                    distance : 10,
                    score : 2,
                    parent : n1,
                };
                const n3 : Node = {
                    vertex : { pos: { x: 0, y: 1 }, adj: emptyList() },
                    distance : 10,
                    score : 14,
                    parent : n2,
                };
                const n4 : Node = {
                    vertex : { pos: { x: 1, y: 1 }, adj: emptyList() },
                    distance : 10,
                    score : 20,
                    parent : n3,
                };
                const l : List<Node> = cons(n1, cons(n2, cons(n3, cons(n4, nil))));
                const l2 : List<Node> = cons(n1, cons(n2, cons(n4, nil)));
                expect(removeNodeFromList(l, n3)).toEqual(l2);
            });
        });
    });

});
