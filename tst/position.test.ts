import { describe, expect, test } from '@jest/globals';

import { Position, createPosition, getX, getY, setPositionX, setPositionY, translatePosition, positionEquals, positionDistance } from '../src/common/position';

describe('Position tests', () => {
    describe('createPosition', () => {
        test('should return the position asked', () => {
            expect(createPosition(0, 7)).toEqual({ x: 0, y: 7 });
            expect(createPosition(-1, 6)).toEqual({ x: -1, y: 6 });
        });
    });

    describe('getX and getY', () => {
        test('should return the x and the y position', () => {
            expect(getX(createPosition(3, 7))).toBe(3);
            expect(getY(createPosition(3, 7))).toBe(7);
        });
    });

    describe('setPositionX and setPositionY', () => {
        test('should return a new position with the asked parameter', () => {
            expect(setPositionX(createPosition(3, 7), 2)).toEqual({ x: 2, y: 7 });
            expect(setPositionY(createPosition(3, 7), 2)).toEqual({ x: 3, y: 2 });
            expect(setPositionX(createPosition(3, 7), -1)).toEqual({ x: -1, y: 7 });
            expect(setPositionY(createPosition(3, 7), -1)).toEqual({ x: 3, y: -1 });
        });
    });

    describe('translatePosition', () => {
        test('should return a new position with its coordinate translated from the asked distance', () => {
            expect(translatePosition(createPosition(1, 2), 4, -3)).toEqual({ x: 5, y: -1 });
        });
    });

    describe('positionEquals', () => {
        test('should return the correct bool', () => {
            expect(positionEquals(createPosition(3, 7), createPosition(3, 7))).toBeTruthy();
            expect(positionEquals(createPosition(1, 7), createPosition(3, 7))).toBeFalsy();
            expect(positionEquals(createPosition(3, 7), createPosition(3, 9))).toBeFalsy();
            expect(positionEquals(createPosition(3, 7), createPosition(2, -1))).toBeFalsy();
        });
    });

    describe('positionDistance', () => {
        const pos1 : Position = createPosition(4, 8);
        const pos2 : Position = createPosition(9, 8);
        expect(positionDistance(pos1, pos2)).toBe(5);
    });
});
