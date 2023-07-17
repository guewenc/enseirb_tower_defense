import { getVertex } from "../src/common/edge";
import { emptyList } from "../src/common/list";
import { createPosition, positionEquals } from "../src/common/position";
import { Vertex } from "../src/common/vertex";
import { World, buildWorld, getDimensionWorld, isInWorld, getVertexByPos } from "../src/world/world";
import { Position } from "../src/common/position";

describe('All world tests', () => {
    describe('buildWorld', () => {
        it('should returns a world of the size needed', () => {
            const w: World = buildWorld(createPosition(20, 20));
            expect(w.size).toEqual(createPosition(20, 20));
            expect(w.graph.n).toBe(20 * 20);
        });
    });

    describe('isInWorld', () => {
        it('should returns if the position is in the world', () => {
            const w: World = buildWorld(createPosition(20, 20));
            expect(isInWorld(w, createPosition(10, 5))).toBeTruthy();
            expect(isInWorld(w, createPosition(20, 20))).toBeTruthy();
        });
    });

    describe('getDimensionWorld', () => {
        it('should returns the dimension of the world', () => {
            const w: World = buildWorld(createPosition(20, 20));
            expect(positionEquals(getDimensionWorld(w), createPosition(20, 20))).toBeTruthy();
        });
    });

    describe('getVertexByPos', () => {
        it('should returns a defined position if the list is empty', () => {
            const v : Vertex = getVertexByPos(emptyList(), createPosition(1, 1));
            expect(v.pos.x).toBe(-1);
            expect(v.pos.y).toBe(-1);
        });
    });
});