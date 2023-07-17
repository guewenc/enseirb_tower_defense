import { describe, expect, test } from '@jest/globals';
import * as list from "../src/common/list";

describe('All list tests', () => {
    test('Test if isEmpty returns true on an empty list', () => {
        expect(list.isEmpty(undefined)).toBe(true);
    });

    test('Test if isEmpty returns false on a non empty list', () => {
        const l: list.List<number> = list.cons(4, list.nil);
        expect(list.isEmpty(l)).toBe(false);
    });

    test('Test if emptyList do returns on empty list', () => {
        expect(list.isEmpty(list.emptyList())).toBe(true);
    });

    test('Test if listEquals returns true with two equal lists', () => {
        const l1 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        const l2 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        expect(list.listEquals(l1, l2, (x: number, y: number) => { return x === y; })).toBe(true);
    });

    test('Test if listEquals returns false with two equal lists but not the same length', () => {
        const l1 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        const l2 = list.cons(4, list.cons(7, list.nil));
        expect(list.listEquals(l1, l2, (x: number, y: number) => { return x === y; })).toBe(false);
    });

    test('Test if listEquals returns false with two non equal lists', () => {
        const l1 = list.cons(4, list.cons(3, list.cons(2, list.nil)));
        const l2 = list.cons(4, list.cons(7, list.cons(1, list.nil)));
        expect(list.listEquals(l1, l2, (x: number, y: number) => { return x === y; })).toBe(false);
    });

    test('Test if calling head on an empty list throw an error', () => {
        const l = list.emptyList();
        expect(() => {
            list.head(l);
        }).toThrow(Error);
    });

    test('Test if calling head on an non empty list returns the first element of the list', () => {
        const l = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        expect(list.head(l)).toBe(4);
    });

    test('Test if calling tail on an empty list throw an error', () => {
        const l = list.emptyList();
        expect(() => {
            list.tail(l);
        }).toThrow(Error);
    });

    test('Test if calling tail on a non empty list returns another list', () => {
        const l1 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        const l2 = list.cons(7, list.cons(2, list.nil));
        expect(list.listEquals(l2, list.tail(l1), (x: number, y: number) => { return x === y; })).toBe(true);
    });

    test('Test if adding in position 0 change the head of the list', () => {
        const l1 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        const l2 = list.addAtList(l1, 5, 0);
        expect(list.head(l2)).toBe(5);
    });

    test('Test if adding keep the tail of the list unchanged', () => {
        const l1 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        const l2 = list.addAtList(l1, 5, 0);
        expect(list.listEquals(l1, list.tail(l2), (x: number, y: number) => { return x === y; })).toBe(true);
    });

    test('Test if adding in a random position returns the expected outcome', () => {
        const l1 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        const l2 = list.addAtList(l1, 5, 2);
        const l3 = list.cons(4, list.cons(7, list.cons(5, list.cons(2, list.nil))));
        expect(list.listEquals(l2, l3, (x: number, y: number) => { return x === y; })).toBe(true);
    });

    test('Test if adding in an empty list modify the head', () => {
        const l1 = list.emptyList();
        const l2 = list.addAtList(l1, 7, 5);
        expect(list.head(l2)).toBe(7);
    });

    test('Test if remove in an empty list return the empty list', () => {
        const l1 = list.emptyList();
        expect(list.isEmpty(list.removeAtList(l1, 0))).toBe(true);
    });

    test('Test if removing at position 0 returns the tail of the list', () => {
        const l1 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        expect(list.listEquals(list.tail(l1), list.removeAtList(l1, 0), (x: number, y: number) => { return x === y; })).toBe(true);
    });

    test('Test if removing in a random position returns the expected outcome', () => {
        const l1 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        const l2 = list.removeAtList(l1, 1);
        const l3 = list.cons(4, list.cons(2, list.nil));
        expect(list.listEquals(l2, l3, (x: number, y: number) => { return x === y; })).toBe(true);
    });

    test('Test of the map function', () => {
        const l1 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        const l2 = list.listMap((x) => { return x + 1; }, l1);
        const l3 = list.cons(5, list.cons(8, list.cons(3, list.nil)));
        expect(list.listEquals(l2, l3, (x: number, y: number) => { return x === y; })).toBe(true);
    });

    test('Test of the foldR function', () => {
        const l1 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        const sum: number = list.listFoldR((acc: number, elt: number) => { return acc + elt; }, 0, l1);
        expect(sum).toBe(13);
    });

    test('Test to append on a non empty list', () => {
        const l1 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        const l2 = list.appendList(l1, 5);
        const l3 = list.cons(4, list.cons(7, list.cons(2, list.cons(5, list.nil))));
        expect(list.listEquals(l2, l3, (x: number, y: number) => { return x === y; })).toBe(true);
    });

    test('Read at position 0 return the head of the list', () => {
        const l1 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        expect(list.readListAt(l1, 0)).toBe(4);
    });

    test('Read at random position returns the expected outcome', () => {
        const l1 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        expect(list.readListAt(l1, 2)).toBe(2);
    });

    test('Try to read an empty list throw an error', () => {
        const l1 = list.emptyList();
        expect(() => {
            list.readListAt(l1, 0);
        }).toThrow(Error);
    });

    test('Try to read at a higher position than the length of the list throw an error', () => {
        const l1 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        expect(() => {
            list.readListAt(l1, 74);
        }).toThrow(Error);
    });

    test('Length of an empty list is O', () => {
        const l1 = list.emptyList();
        expect(list.listLength(l1)).toBe(0);
    });

    test('Length of a non empty list returns the expected outcome', () => {
        const l1 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        expect(list.listLength(l1)).toBe(3);
    });

    test('Change an element of the list', () => {
        const l1 = list.cons(4, list.cons(7, list.cons(2, list.nil)));
        const l2 = list.changeListAt(l1, 5, 1);
        const l3 = list.cons(4, list.cons(5, list.cons(2, list.nil)));
        expect(list.listEquals(l2, l3, (x: number, y: number) => { return x === y; })).toBeTruthy();
    });

    describe('searchList', () => {
        test('should return -1 when given an empty list', () => {
            expect(list.searchList(list.emptyList(), 1, (a, b) => a === b)).toEqual(-1);
        });

        test('should return -1 when the element is not found in the list', () => {
            const l = list.cons(1, list.cons(2, list.cons(3, list.nil)));
            expect(list.searchList(l, 4, (a, b) => a === b)).toEqual(-1);
        });

        test('should return the correct index when the element is found in the list', () => {
            const l1 = list.cons(1, list.cons(2, list.cons(3, list.nil)));
            const l2 = list.cons('apple', list.cons('banana', list.cons('cherry', list.nil)));
            expect(list.searchList(l1, 2, (a, b) => a === b)).toEqual(1);
            expect(list.searchList(l2, 'cherry', (a, b) => a === b)).toEqual(2);
        });

        test('should work with custom comparison functions', () => {
            const p = [{ name: 'Alice', age: 20 }, { name: 'Bob', age: 25 }, { name: 'Charlie', age: 30 },];
            const l = list.cons(p[0], list.cons(p[1], list.cons(p[2], list.nil)));
            const cmpFunc = (a: any, b: any) => a.name === b.name;
            expect(list.searchList(l, { name: 'Charlie', age: 35 }, cmpFunc)).toEqual(2);
        });
    });

    describe('arrayToList', () => {
        it('should returns a list', () => {
            const l: list.List<number> = list.cons(4, list.cons(2, list.nil));
            expect(list.listEquals(l, list.arrayToList([4, 2]), (x: number, y: number) => { return x === y; })).toBeTruthy();
        });

        it('should returns an empty list if the array is empty', () => {
            expect(list.arrayToList([]) === list.nil);
        });
    });

    describe('concatList', () => {
        it('should concatenate two lists', () => {
            const l1: list.List<number> = list.cons(4, list.cons(2, list.nil));
            const l2: list.List<number> = list.cons(3, list.cons(6, list.cons(8, list.nil)));
            const l3: list.List<number> = list.cons(4, list.cons(2, list.cons(3, list.cons(6, list.cons(8, list.nil)))));
            expect(list.listEquals(l3, list.concatList(l1, l2), (x: number, y: number) => { return x === y; })).toBeTruthy();
        });
    });

    describe('randomList', () => {
        it('should returns a element that is in the list', () => {
            const l: list.List<number> = list.cons(3, list.cons(6, list.cons(8, list.nil)));
            const n = list.randomList(l);
            expect(n === 8 || n === 6 || n === 3).toBeTruthy();
        });

        it('should return undefined if the list is empty', () => {
            const l: list.List<number> = list.emptyList();
            expect(list.randomList(l)).toBe(undefined);
        });
    });
});