/**
 * External imports
 */
import { values, map, pick, keys } from 'lodash';
import { isModelEntityOfModel } from '@eventespresso/validators';
import { InvalidModelEntity } from '@eventespresso/eejs';
import {
	pluralModelName,
	singularModelName,
} from '@eventespresso/model';

/**
 * Returns all entity records for the given modelName in the current state.
 * An entity record is the complete object indexed by the primary key id.
 * @param {Object} state
 * @param {string} modelName
 * @return {Object<Object>}|null} A collection of entity records for the given
 * model indexed by primary key value or null if none have been set in the
 * state.
 */
export function getEntityRecordsForModel( state, modelName ) {
	return state.entities[ modelName ] ?
		state.entities[ modelName ] :
		null;
}

/**
 * Returns all entities for the given model.
 * This differs from entityRecords, in that the entities are NOT indexed by
 * primary key value and an Array of entities is returned instead of an object.
 *
 * @param {Object} state
 * @param {string} modelName
 * @return {Array<Object>|null} An array of entities for the given model or null
 * if none have been set in the state.
 */
export function getEntitiesForModel( state, modelName ) {
	return state.entities[ modelName ] ?
		values( state.entities[ modelName ] ) :
		null;
}

/**
 * Returns the model entity for the given model and id.
 *
 * @param {Object} state
 * @param {string} modelName
 * @param {string} entityId
 * @return {Object|null} Returns the model entity or null.
 */
export function getEntityById( state, modelName, entityId ) {
	return state.entities[ modelName ] &&
		state.entities[ modelName ][ String( entityId ) ] ?
		state.entities[ modelName ][ String( entityId ) ] :
		null;
}

/**
 * Retrieves an array of model entities for the provided array of ids and model.
 *
 * @param {Object} state
 * @param {string} modelName
 * @param {Array<string>} entityIds
 * @return {Array<Object>|null} Returns an array of model entities for the
 * provided ids or null if never been set.
 */
export function getEntitiesByIds( state, modelName, entityIds ) {
	// ensure entityIds are strings for our key pick
	entityIds = map( entityIds, ( id ) => String( id ) );
	return state.entities[ modelName ] ?
		values( pick( state.entities[ modelName ], entityIds ) ) :
		null;
}

export function getEntitiesQueuedForTrash( state, modelName ) {
	return state.dirty.delete[ modelName ] ?
		state.dirty.delete[ modelName ] :
		[];
}

export function getEntitiesQueuedForDelete( state, modelName ) {
	return state.dirty.trash[ modelName ] ?
		state.dirty.trash[ modelName ] :
		[];
}

export function getModelsQueuedForTrash( state ) {
	return keys( state.dirty.trash );
}

export function getModelsQueuedForDelete( state ) {
	return keys( state.dirty.delete );
}

export function getRelationEntitiesForEntity(
	state,
	modelName,
	entity,
	relationModelName
) {
	if ( ! isModelEntityOfModel( entity, modelName ) ) {
		throw new InvalidModelEntity( '', entity );
	}
	const relations = state.relations;
	const pluralRelationName = pluralModelName( relationModelName );
	const singularRelationName = singularModelName( relationModelName );
	const relationIds = relations[ modelName ] &&
		relations[ modelName ][ entity.id ] &&
		relations[ modelName ][ entity.id ][ pluralRelationName ] ?
		relations[ modelName ][ entity.id ][ pluralRelationName ] :
		[];
	return getEntitiesByIds( state, singularRelationName, relationIds );
}

export function getRelationAdditionsQueuedForModel( state, modelName ) {
	if ( ! state.dirty.relations.add[ modelName ] ) {
		return {};
	}
	return state.dirty.relations.add[ modelName ];
}


export function getRelationDeletionsQueuedForModel( state, modelName ) {
	if ( ! state.dirty.relations.delete[ modelName ] ) {
		return {};
	}
	return state.dirty.relations.delete[ modelName ];
}
