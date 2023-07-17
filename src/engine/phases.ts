/**
 * @file phases.ts
 * @brief Defines types and functions related to game phases and actor actions proposals.
 */

import { World, isInWorld } from "../world/world";
import { Actor, ActorActions, getActorById, removeActor, replaceActor, setLifePoint } from "../actors/actors";
import { List, appendList, arrayToList, listFoldR } from "../common/list";

/**
 * @typedef Proposal
 *
 * @brief A proposal for an action to be taken by an actor during a game phase.
 *
 * @property {MoveProposal} MoveProposal - An actor movement proposal.
 * @property {AttackProposal} AttackProposal - An actor attack proposal.
 * @property {SpawnProposal} SpawnProposal - An actor spawn proposal.
 * @property {HealProposal} HealProposal - An actor healing proposal.
 * @property {undefined} undefined - An undefined proposal.
 */
type Proposal = MoveProposal | AttackProposal | SpawnProposal | HealProposal | undefined

/**
 * @typedef MoveProposal
 *
 * @brief An actor movement proposal.
 *
 * @type {Actor}
 */
type MoveProposal = Actor

/**
 * @typedef AttackProposal
 *
 * @brief An actor attack proposal.
 *
 * @property {number} id - The id of the attacked actor
 * @property {number} damage - The amount of damage
 */
type AttackProposal = List<{ id: number, damage: number }>

/**
 * @typedef SpawnProposal
 *
 * @brief An actor spawn proposal.
 *
 * @property {Actor} newState - The new actor state.
 * @property {Actor} spawnedActor - The actor to be spawned.
 */
type SpawnProposal = Actor | undefined

/**
 * @typedef HealProposal
 *
 * @brief An actor healing proposal.
 *
 * @property {number} id - The id of the healed actor
 * @property {number} heal - The amount of heal
 */
type HealProposal = List<{ id: number, heal: number }>

/**
 * @typedef Resolver
 *
 * @brief A function that resolves the proposals of actors during a game phase.
 *
 * @param {World} aWorld - The game world.
 * @param {List<Actor>} actors - The list of actors.
 * @param {List<Proposal>} proposals - The list of proposals to be resolved.
 * @returns {Array} A tuple of the updated world and the updated list of actors.
 */
type Resolver = (aWorld: World, actors: List<Actor>, proposals: List<Proposal>) => [World, List<Actor>]

/**
 * @typedef Phase
 *
 * @brief A game phase.
 *
 * @property {keyof ActorActions} funcName - The function name in ActorActions corresponding to the phase.
 * @property {Resolver} resolver - The resolver function for the phase.
 */
type Phase = {
    readonly funcName: keyof ActorActions;
    resolver: Resolver
}

/**
 * @typedef PhaseAction
 *
 * @brief A function that returns an action proposal for an actor in a game phase.
 *
 * @param {Actor} anActor - The actor for which to return the proposal.
 * @param {World} aWorld - The game world.
 * @param {List<Actor>} actors - The list of actors.
 * @returns {Proposal} A proposal for an action to be taken by the actor in the game phase.
 */
type PhaseAction<ProposalType> = (anActor: Actor, aWorld: World, actors: List<Actor>) => ProposalType;


/**
 * @brief Computes the different phases of the game based on the current state of the game.
 *
 * @param {World} world - The current world state of the game.
 * @param {List<Actor>} actors - The current list of actors in the game.
 * @returns {Phase[]} - An array containing the different phases of the game.
 */
function computePhases(world: World, actors: List<Actor>): List<Phase> {
    return arrayToList(<Phase[]>[
        {
            funcName: "move", //potentially it can take in consideration different kind of field (some can slow you...)
            resolver: function (aWorld: World, actors: List<Actor>, proposals: List<MoveProposal>): [World, List<Actor>] {
                return listFoldR(function (acc, proposal) {
                    if (proposal && isInWorld(aWorld, proposal.position))
                        return [acc[0], replaceActor(acc[1], proposal)];
                    return acc;
                }, [aWorld, actors], proposals);
            }
        }, {
            funcName: "attack", //potentially we can add side affect such as poison, freeze...
            resolver: function (aWorld: World, actors: List<Actor>, proposals: List<AttackProposal>): [World, List<Actor>] {
                return listFoldR(function (acc, proposal) {
                    if (proposal)
                        return listFoldR(function (acc2, attack) {
                            const anActor = getActorById(acc2[1], attack.id);
                            if (anActor)
                                if (anActor.health <= attack.damage)
                                    return [acc2[0], removeActor(acc2[1], anActor.id)];
                                else
                                    return [acc2[0], replaceActor(acc2[1], setLifePoint(anActor, anActor.health - attack.damage))];
                            return acc2;
                        }, acc, proposal);
                    return acc;
                }, [aWorld, actors], proposals);
            }
        }, {
            funcName: "spawn",
            resolver: function (aWorld: World, actors: List<Actor>, proposals: List<SpawnProposal>): [World, List<Actor>] {
                return listFoldR(function (acc, proposal) {
                    if (proposal)
                        return [acc[0], appendList(actors, proposal)];
                    return acc;
                }, [aWorld, actors], proposals);
            }
        }, {
            funcName: "heal", //potentially this phase can be used to decrease the health of a monster, with poison for instance
            resolver: function (aWorld: World, actors: List<Actor>, proposals: List<HealProposal>): [World, List<Actor>] {
                return listFoldR(function (acc, proposal) {
                    if (proposal)
                        return listFoldR(function (acc2, attack) {
                            const anActor = getActorById(acc2[1], attack.id);
                            if (anActor)
                                if (anActor.health + attack.heal > anActor.maxHealth)
                                    return [acc2[0], replaceActor(acc2[1], setLifePoint(anActor, anActor.maxHealth))];
                                else
                                    return [acc2[0], replaceActor(acc2[1], setLifePoint(anActor, anActor.health + attack.heal))];
                            return acc2;
                        }, acc, proposal);
                    return acc;
                }, [aWorld, actors], proposals);
            }
        },
    ]);
}

export {
    Phase,
    PhaseAction,
    Proposal,
    MoveProposal,
    AttackProposal,
    SpawnProposal,
    HealProposal,
    computePhases
};