/**
 * Internal imports
 */
import { getFactoryForModel, getSchemaForModel } from './schema/resolvers';
import { select, dispatch } from './base-controls';
import { REDUCER_KEY as CORE_REDUCER_KEY } from './core/constants';
import { REDUCER_KEY as SCHEMA_REDUCER_KEY } from './schema/constants';

/**
 * Returns the factory for the given model from the eventespresso/schema store.
 *
 * @param {string} modelName
 * @return {IterableIterator<*>|Object} A generator or the object once the
 * factory is retrieved.
 */
export function* getFactoryByModel( modelName ) {
	let factory;
	const resolved = yield select(
		SCHEMA_REDUCER_KEY,
		'hasResolvedFactoryForModel',
		modelName
	);
	if ( resolved === true ) {
		factory = yield select(
			SCHEMA_REDUCER_KEY,
			'getFactoryForModel',
			modelName
		);
		return factory;
	}
	const schema = yield getSchemaByModel( modelName );
	factory = yield getFactoryForModel( modelName, schema );
	yield dispatch(
		SCHEMA_REDUCER_KEY,
		'receiveFactoryForModel',
		modelName,
		factory,
	);
	yield dispatch(
		'core/data',
		'finishResolution',
		SCHEMA_REDUCER_KEY,
		'getFactoryForModel',
		[ modelName ]
	);
	return factory;
}

/**
 * Returns the schema for the given model from the eventespresso/schema store.
 *
 * @param {string} modelName
 * @return {IterableIterator<*>|Object} A generator of the object once the
 * schema is retrieved.
 */
export function* getSchemaByModel( modelName ) {
	let schema;
	const resolved = yield select(
		SCHEMA_REDUCER_KEY,
		'hasResolvedSchemaForModel',
		modelName
	);
	if ( resolved === true ) {
		schema = yield select(
			SCHEMA_REDUCER_KEY,
			'getSchemaForModel',
			modelName
		);
		return schema;
	}
	schema = yield getSchemaForModel( modelName );
	yield dispatch(
		SCHEMA_REDUCER_KEY,
		'receiveSchemaForModel',
		modelName,
		schema,
	);
	yield dispatch(
		'core/data',
		'finishResolution',
		SCHEMA_REDUCER_KEY,
		'getSchemaForModel',
		[ modelName ]
	);
	return schema;
}

/**
 * Handles ensuring that the resolution state for the `getEntityById` for all
 * provided entityIds is recorded as finished.
 *
 * @param {string} modelName
 * @param {Array} entityIds
 */
export function* resolveGetEntityByIdForIds( modelName, entityIds ) {
	while ( entityIds.length > 0 ) {
		yield dispatch(
			'core/data',
			'finishResolution',
			CORE_REDUCER_KEY,
			'getEntityById',
			[ modelName, entityIds.shift() ]
		);
	}
}
