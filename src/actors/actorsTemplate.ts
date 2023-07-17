import { randomList, concatList, cons, emptyList, head } from "../common/list";
import { createPosition } from "../common/position";
import { Actor, setActorPosition, getActorsByType, chooseNeighbor, setLifePoint, copyActor, getAllActorsInRange, getNextEnemyPos, copyNewActor } from "./actors";

const remyWithSpoon: Actor = {
    id: -1,
    position: createPosition(0, 5),
    type: "ENEMY",
    name: "Remy with a Spoon",
    health: 200,
    maxHealth: 200,
    actions: {
        move: (anActor, aWorld, actors) => setActorPosition(anActor, getNextEnemyPos(anActor, actors, aWorld)),
        attack: function (anActor, _aWorld, actors) {
            const target = randomList(concatList(getActorsByType(getAllActorsInRange(actors, anActor, 1), "GOAL"), getActorsByType(getAllActorsInRange(actors, anActor, 1), "TOWER")));
            if (target)
                return cons({ id: target.id, damage: 20 }, emptyList());
            return undefined;
        },
        heal: (anActor, _aWorld, _actors) => cons({ id: anActor.id, heal: 10 }, emptyList()),
    }
};

const hungryRemyWithSpoon: Actor = {
    id: -1,
    position: createPosition(1, 1),
    type: "ENEMY",
    name: "Hungry Remy with a Spoon",
    health: 500,
    maxHealth: 500,
    actions: {
        move: (anActor, aWorld, actors) => setActorPosition(anActor, getNextEnemyPos(anActor, actors, aWorld)),
        attack: function (anActor, _aWorld, actors) {
            const target = randomList(concatList(getActorsByType(getAllActorsInRange(actors, anActor, 1), "GOAL"), getActorsByType(getAllActorsInRange(actors, anActor, 1), "TOWER")));
            if (target)
                return cons({ id: target.id, damage: 50 }, emptyList());
            return undefined;
        },
        heal: (anActor, _aWorld, _actors) => cons({ id: anActor.id, heal: 10 }, emptyList()),
    }
};

const remyThrowingCheese: Actor = {
    id: -1,
    position: createPosition(1, 1),
    type: "ENEMY",
    name: "Remy Throwing Cheese",
    health: 200,
    maxHealth: 200,
    actions: {
        move: (anActor, aWorld, actors) => setActorPosition(anActor, getNextEnemyPos(anActor, actors, aWorld)),
        attack: function (anActor, _aWorld, actors) {
            const target = randomList(concatList(getActorsByType(getAllActorsInRange(actors, anActor, 3), "GOAL"), getActorsByType(getAllActorsInRange(actors, anActor, 1), "TOWER")));
            if (target)
            return cons({ id: target.id, damage: 10 }, emptyList());
            return undefined;
        },
        heal: (anActor, _aWorld, _actors) => cons({ id: anActor.id, heal: 10 }, emptyList()),
    }
};


const gusteauWithPan: Actor = {
    id: -1,
    position: createPosition(5, 5),
    type: "TOWER",
    name: "Gusteau with a Pan",
    health: 200,
    maxHealth: 200,
    actions: {
        attack: function (anActor, _aWorld, actors) {
            const target = randomList(getActorsByType(getAllActorsInRange(actors, anActor, 2), "ENEMY"));
            if (target)
                return cons({ id: target.id, damage: 20 }, emptyList());
            return undefined;
        },
        heal: (anActor, _aWorld, _actors) => cons({ id: anActor.id, heal: 10 }, emptyList()),
    }
};

const angryGusteauWithPan: Actor = {
    id: -1,
    position: createPosition(5, 6),
    type: "TOWER",
    name: "Angry Gusteau with a Pan",
    health: 300,
    maxHealth: 300,
    actions: {
        attack: function (anActor, _aWorld, actors) {
            const target = randomList(getActorsByType(getAllActorsInRange(actors, anActor, 2), "ENEMY"));
            if (target)
                return cons({ id: target.id, damage: 30 }, emptyList());
            return undefined;
        },
        heal: (anActor, _aWorld, _actors) => cons({ id: anActor.id, heal: 10 }, emptyList()),
    }
};

const veryAngryGusteauWithPan: Actor = {
    id: -1,
    position: createPosition(6, 5),
    type: "TOWER",
    name: "Very Angry Gusteau with a Pan",
    health: 500,
    maxHealth: 500,
    actions: {
        attack: function (anActor, _aWorld, actors) {
            const target = randomList(getActorsByType(getAllActorsInRange(actors, anActor, 2), "ENEMY"));
            if (target)
                return cons({ id: target.id, damage: 50 }, emptyList());
            return undefined;
        },
        heal: (anActor, _aWorld, _actors) => cons({ id: anActor.id, heal: 10 }, emptyList()),
    }
};

const linguini: Actor = {
    id: -1,
    position: createPosition(8, 5),
    type: "GOAL",
    name: "Linguini",
    health: 50,
    maxHealth: 50,
    actions: {
        heal: (anActor, _aWorld, _actors) => cons({ id: anActor.id, heal: 5 }, emptyList()),
    }
};

const marmite: Actor = {
    id: -1,
    position: createPosition(1,1),
    type: "WALL",
    name: "Marmite",
    health: 1000,
    maxHealth: 1000,
    actions: {
    }
};

const worktop: Actor = {
    id: -1,
    position: createPosition(1,1),
    type: "WALL",
    name: "Worktop",
    health: 1000,
    maxHealth: 1000,
    actions: {
    }
};

//const 

const hole: Actor = {
    id: -1,
    position: createPosition(0,5),
    type: "SPAWNER",
    name: "Hole",
    health: 20,
    maxHealth: 20,
    actions: {
        attack: (anActor, _aWorld, _actors) => cons({ id: anActor.id, damage: 1 }, emptyList()),
        spawn: function (anActor, _aWorld, _actors) {
            if (anActor.health % 3 === 0)
                return copyNewActor(setActorPosition(remyWithSpoon, createPosition(0,5)));
            return undefined;
        }
    }
};

//tour qui attaque tout les ennemy autour d'elle
//tour qui attaque les ennemy avec des dégats de zone

export {
    remyWithSpoon,
    hungryRemyWithSpoon,
    remyThrowingCheese,
    gusteauWithPan,
    angryGusteauWithPan,
    veryAngryGusteauWithPan,
    linguini,
    worktop,
    marmite,
    hole
};
