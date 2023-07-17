import { describe, expect, test } from '@jest/globals';
import { createEdge, getVertex, getWeight, setWeight, edgeEquals } from "../src/common/edge";
import { createVertex } from "../src/common/vertex";
import { createPosition } from '../src/common/position';

describe("Edge functions", () => {
    const v1 = createVertex(createPosition(0, 0), undefined);
    const v2 = createVertex(createPosition(1, 1), undefined);
    const e1 = createEdge(10, v1);
    const e2 = createEdge(20, v2);

    describe("createEdge", () => {
        test("should create an edge with given weight and vertex", () => {
            expect(createEdge(10, v1)).toEqual({ weight: 10, vertex: v1 });
        });
    });

    describe("getVertex", () => {
        test("should return the vertex of the given edge", () => {
            expect(getVertex(e1)).toEqual(v1);
            expect(getVertex(e2)).toEqual(v2);
        });
    });

    describe("getWeight", () => {
        test("should return the weight of the given edge", () => {
            expect(getWeight(e1)).toEqual(10);
            expect(getWeight(e2)).toEqual(20);
        });
    });

    describe("setWeight", () => {
        test("should return a new edge with updated weight", () => {
            expect(setWeight(e1, 15)).toEqual({ weight: 15, vertex: v1 });
            expect(setWeight(e2, 25)).toEqual({ weight: 25, vertex: v2 });
        });
    });

    describe("edgeEquals", () => {
        test("should return true if two edges are equal", () => {
            expect(edgeEquals(e1, e1)).toBe(true);
            expect(edgeEquals(e2, e2)).toBe(true);
        });

        test("should return false if two edges are not equal", () => {
            expect(edgeEquals(e1, e2)).toBe(false);
            expect(edgeEquals(e2, e1)).toBe(false);
        });
    });
});
