/**
 * @file list.ts
 * @brief This file defines a generic list cell and a linked list type.
 */

/**
 * @brief A cons cell is a pair of elements where the first element is called 'car' and the second element is called 'cdr'.
 *
 * @typeparam T Type of the first element (car).
 * @typeparam U Type of the second element (cdr).
 */
type PointedPair<T, U> = {
    car: T;
    cdr: U;
};

/**
 * @brief Get the value of the first element (car) of a cons cell.
 *
 * @typeparam T Type of the first element (car).
 * @typeparam U Type of the second element (cdr).
 * @param {PointedPair<T, U>} cons The cons cell to get the first element from.
 * @returns {T} The first element (car) of the cons cell.
 */
const car = <T, U>(cons: PointedPair<T, U>): T => cons.car;

/**
 * @brief Get the value of the second element (cdr) of a cons cell.
 *
 * @typeparam T Type of the first element (car).
 * @typeparam U Type of the second element (cdr).
 * @param {PointedPair<T, U>} cons The cons cell to get the second element from.
 * @returns {U} The second element (cdr) of the cons cell.
 */
const cdr = <T, U>(cons: PointedPair<T, U>): U => cons.cdr;

/**
 * @brief Create a new cons cell.
 *
 * @typeparam T Type of the first element (car).
 * @typeparam U Type of the second element (cdr).
 * @param {T} _car The value of the first element (car).
 * @param {U} _cdr The value of the second element (cdr).
 * @returns {PointedPair<T, U>} A new cons cell with the given values for car and cdr.
 */
function cons<T, U>(_car: T, _cdr: U): PointedPair<T, U> {
    return { car: _car, cdr: _cdr };
}

/**
 * @brief A linked list is a collection of cons cells where the car of each cons cell is a value of the list and the cdr points to the next element in the list.
 *
 * @typeparam T Type of the elements in the list.
 */
type List<T> = undefined | { car: T, cdr: List<T> };

/**
 * @brief An empty list.
 *
 * @typeparam T Type of the elements in the list.
 */
const nil = undefined;

/**
 * @brief Check if a list is empty.
 *
 * @param {List<T>} l The list to check.
 * @returns {l is undefined} True if the list is empty, false otherwise.
 */
const isEmpty = <T>(l: List<T>): l is undefined => l === nil;

/**
 * @brief Get the head element of a list.
 *
 * @param {List<T>} l The list to get the head element from.
 * @returns {T} The head element of the list.
 * @throws An error if the list is empty.
 */
function head<T>(l: List<T>): T {
    if (!isEmpty(l))
        return car(l);
    throw new Error('List is empty');
}

/**
 * @brief Get the tail of a list.
 *
 * @param {List<T>} l The list to get the tail of.
 * @returns {List<T>} The tail of the list.
 * @throws An error if the list is empty.
 */
function tail<T>(l: List<T>): List<T> {
    if (!isEmpty(l))
        return cdr(l);
    throw new Error('List is empty');
}

/*******************************************************************************
 * All functions return new lists (no side effects in functional programming). *
********************************************************************************/

/**
 * @brief Compares two lists to determine if they are equal.
 *
 * @template T
 * @param {List<T>} l1 The first list to compare.
 * @param {List<T>} l2 The second list to compare.
 * @param {(elt1: T, elt2: T) => boolean} cmpFunc The comparison function to use for list elements.
 * @returns {boolean} True if the lists are equal, false otherwise.
 */
function listEquals<T>(l1: List<T>, l2: List<T>, cmpFunc: (elt1: T, elt2: T) => boolean): boolean {
    if (isEmpty(l1) && isEmpty(l2))
        return true;
    else if (isEmpty(l1) || isEmpty(l2))
        return false;
    return cmpFunc(head(l1), head(l2)) && listEquals(tail(l1), tail(l2), cmpFunc);
}

/**
 * @brief Copies a list.
 *
 * @template T
 * @param {List<T>} l The list to copy.
 * @returns {List<T>} A new list that is a copy of the original.
 */
function copyList<T>(l: List<T>): List<T> {
    if (isEmpty(l))
        return nil;
    return cons(head(l), copyList(tail(l)));
}

/**
 * @brief Returns an empty list.
 *
 * @template T
 * @returns {List<T>} - An empty list.
 */
const emptyList = () => nil;

/**
 * @brief Adds an element to a list at a given position.
 *
 * @param {List<T>} l The list to add the element to.
 * @param {T} elt The element to add to the list.
 * @param {number} pos The position in the list where the element should be added.
 * @returns {List<T>} A new list with the element added at the specified position.
 */
function addAtList<T>(l: List<T>, elt: T, pos: number): List<T> {
    if (isEmpty(l))
        return cons(elt, nil);
    else if (pos <= 0)
        return cons(elt, copyList(l));
    return cons(head(l), addAtList(tail(l), elt, pos - 1));
}

/**
 * @brief Removes an element at a given position from a list.
 *
 * @param {List<T>} l The list to remove the element from.
 * @param {number} pos The position in the list of the element to remove.
 * @returns {List<T>} A new list with the specified element removed.
 */
function removeAtList<T>(l: List<T>, pos: number): List<T> {
    if (isEmpty(l))
        return nil;
    else if (pos <= 0)
        return copyList(tail(l));
    return cons(head(l), removeAtList(tail(l), pos - 1));
}

/**
 * @brief Changes an element at a given position in a list to a new element.
 *
 * @param {List<T>} l The list to change the element in.
 * @param {T} elt The new element to replace the old element.
 * @param {number} pos The position of the element to be changed.
 * @returns {List<T>} A new list with the specified element changed to the new element.
 */
function changeListAt<T>(l: List<T>, elt: T, pos: number): List<T> {
    return addAtList(removeAtList(l, pos), elt, pos);
}

/**
 * @brief Maps a list to a new list using a mapping function.
 *
 * @template T The type of elements in the original list.
 * @template Img The type of elements in the mapped list.
 * @param {function(T): Img} f The mapping function.
 * @param {List<T>} l The list to map.
 * @returns {List<Img>} The mapped list.
 */
function listMap<T, Img>(f: (x: T) => Img, l: List<T>): List<Img> {
    if (isEmpty(l))
        return l;
    return cons(f(head(l)), listMap(f, tail(l)));
}

/**
 * @brief Folds a list to a single value using a folding function.
 *
 * @template Acc The type of the accumulator value.
 * @template T The type of elements in the list.
 * @param {function(Acc, T): Acc} f The folding function.
 * @param {Acc} init The initial value of the accumulator.
 * @param {List<T>} l The list to fold.
 * @returns {Acc} The folded value.
 */
function listFoldR<Acc, T>(f: (acc: Acc, elt: T) => Acc, init: Acc, l: List<T>): Acc {
    if (isEmpty(l))
        return init;
    return f(listFoldR(f, init, tail(l)), head(l));
}

/**
 * @brief Appends an element to the end of a list.
 *
 * @template T The type of elements in the list.
 * @param {List<T>} l The list to append to.
 * @param {T} elt The element to append.
 * @returns {List<T>} The list with the element appended.
 */
function appendList<T>(l: List<T>, elt: T): List<T> {
    if (isEmpty(l))
        return cons(elt, nil);
    return cons(head(l), appendList(tail(l), elt));
}

/**
 * @brief Returns the element of the list at a given position.
 *
 * @tparam T The type of the elements in the list.
 * @param {List<T>} l The list.
 * @param {number} pos The position of the element to return.
 * @return {T} The element of the list at the given position.
 * @throws Error if the list is empty.
 */
function readListAt<T>(l: List<T>, pos: number): T {
    if (isEmpty(l))
        throw new Error;
    else if (pos <= 0)
        return head(l);
    return readListAt(tail(l), pos - 1);
}

/**
 * @brief Returns the length of the list.
 *
 * @tparam T The type of the elements in the list.
 * @param {List<T>} l The list.
 * @return {number} number The length of the list.
 */
function listLength<T>(l: List<T>): number {
    function listLengthINT<T>(l: List<T>, res: number): number {
        if (isEmpty(l))
            return res;
        return listLengthINT(tail(l), res + 1);
    }
    return listLengthINT(l, 0);
}

/**
 * @brief Searches the list for an element that satisfies the given comparison function.
 *
 * @tparam T The type of the elements in the list.
 * @param {List<T>} l The list to search.
 * @param {T} elt The element to search for.
 * @param {(T, T) => boolean} cmpFunc The comparison function to use. Returns true if the two elements are equal.
 * @return {number} number The index of the first element that satisfies the comparison function, or -1 if no such element is found.
 */
function searchList<T>(l: List<T>, elt: T, cmpFunc: (elt1: T, elt2: T) => boolean): number {
    function searchListINT<T>(l: List<T>, elt: T, pos: number, cmpFunc: (elt1: T, elt2: T) => boolean): number {
        if (isEmpty(l))
            return -1;
        if (cmpFunc(head(l), elt))
            return pos;
        return searchListINT(tail(l), elt, pos + 1, cmpFunc);
    }
    return searchListINT(l, elt, 0, cmpFunc);
}

/**
 * @brief Convert an array to a linked list.
 *
 * @typeparam T Type of the elements in the array and list.
 * @param {T[]} arr The array to convert.
 * @returns {List<T>} A linked list containing the elements of the array.
 */
function arrayToList<T>(arr: T[]): List<T> {
    if (arr.length === 0)
        return nil;
    return cons(arr[0], arrayToList(arr.slice(1)));
}

/**
 * @brief Concatenates two lists.
 *
 * This function creates a new list by concatenating two input lists l1 and l2.
 *
 * @param {List<T>} l1 The first list.
 * @param {List<T>} l2 The second list.
 * @return {List<T>} Returns a new list that is the concatenation of l1 and l2.
 *
 * @tparam T The type of the elements in the lists.
 */
function concatList<T>(l1: List<T>, l2: List<T>): List<T> {
    if (isEmpty(l1))
        return l2;
    return cons(head(l1), concatList(tail(l1), l2));
}

/**
 * @brief Returns a random element from a list.
 *
 * This function returns a random element from a given list l. If the list is empty, returns undefined.
 *
 * @param {List<T>} l The input list.
 * @return {T | undefined} Returns a random element from l, or undefined if l is empty.
 *
 * @tparam T The type of the elements in the list.
 */
function randomList<T>(l: List<T>): T | undefined {
    if (isEmpty(l))
        return undefined;
    return readListAt(l, Math.floor(Math.random() * listLength(l)));
}

export {
    List,
    nil,
    cons,
    isEmpty,
    head,
    tail,
    listEquals,
    copyList,
    emptyList,
    addAtList,
    removeAtList,
    changeListAt,
    listMap,
    listFoldR,
    appendList,
    readListAt,
    listLength,
    searchList,
    arrayToList,
    concatList,
    randomList,
};