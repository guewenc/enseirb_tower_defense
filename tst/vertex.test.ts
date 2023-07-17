import { describe, expect, test } from '@jest/globals';
import { Vertex, addEdge, createVertex, getPos, getVertexByPos, setPos, vertexEquals } from '../src/common/vertex';
import { createPosition } from '../src/common/position';
import { List, emptyList, cons, nil, isEmpty } from '../src/common/list';
import { Edge, createEdge } from '../src/common/edge';

describe('All vertex tests', () => {
    test('createVertex returns the expected vertex', () => {
        expect(createVertex(createPosition(7, 4), undefined)).toEqual({ pos: createPosition(7, 4), adj: emptyList() });
        expect(createVertex(createPosition(7, -1), undefined)).toEqual({ pos: createPosition(7, -1), adj: emptyList() });
    });

    test('getPos returns the position of the vertex', () => {
        expect(getPos(createVertex(createPosition(-1, 8), undefined))).toEqual(createPosition(-1, 8));
    });

    test('setPos returns a new vertex with the requested position', () => {
        expect(setPos(createVertex(createPosition(7, 8), undefined), createPosition(-1, 9))).toEqual({ pos: createPosition(-1, 9), adj: emptyList() });
    });

    test('vertexEquals returns the expected boolean', () => {
        expect(vertexEquals(createVertex(createPosition(-1, 9), undefined), createVertex(createPosition(-1, 9), undefined))).toBeTruthy();
        expect(vertexEquals(createVertex(createPosition(-1, 9), undefined), createVertex(createPosition(1, -9), undefined))).toBeFalsy();
        expect(vertexEquals(createVertex(createPosition(-1, 9), undefined), createVertex(createPosition(-1, 6), undefined))).toBeFalsy();
        expect(vertexEquals(createVertex(createPosition(-1, 9), undefined), createVertex(createPosition(-3, 9), undefined))).toBeFalsy();
    });

    test('getVertexByPos returns the expected vertex', () => {
        const l: List<Vertex> = cons(createVertex(createPosition(-1, 9), undefined), cons(createVertex(createPosition(2, 3), undefined), cons(createVertex(createPosition(4, 5), undefined), nil)));
        const v: Vertex = getVertexByPos(l, createPosition(4, 5));
        expect(vertexEquals(v, createVertex(createPosition(4, 5), undefined))).toBeTruthy();
    });

    test('getVertexByPos throws an error if the needed vertex isn\'t in the list', () => {
        const l: List<Vertex> = cons(createVertex(createPosition(-1, 9), undefined), cons(createVertex(createPosition(2, 3), undefined), cons(createVertex(createPosition(4, 5), undefined), nil)));
        expect(() => {
            getVertexByPos(l, createPosition(3, 5));
        }).toThrow("Can't find vertex at 3 5");
    });

    test('addEdge do adds an edge to the vertex', () => {
        const v1: Vertex = createVertex(createPosition(4, 5), undefined);
        const v2: Vertex = createVertex(createPosition(1, 7), undefined);
        const e: Edge = createEdge(1, v2);
        const v3: Vertex = addEdge(v1, e);
        expect(isEmpty(v3.adj)).toBeFalsy();
    });
});
