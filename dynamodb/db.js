/**
 * Dynamodb interface implementation
 */
import expressionBuilder from './expression_builder'
import debugCreator from 'debug'

const debug = debugCreator('churnapi:db')

/**
 * The document client used to interface with the database
 */
let docClient
const setDoc = _docClient => docClient = _docClient

/**
 * The cache used to store resources grabbed within a single call.
 * This is so that if multiple fields/permissions/validations require the
 * same resource within a call, it will only be grabbed once
 */
let resourceCache = {}

/**
 * Clear the resource cache
 */
const clearCache = () => resourceCache = {}

/**
 * Get a resource from the DB
 * The params provided match graphql's param object layout and context
 */
const getResource = params => {
  return docClient.get(params).promise().then(result => {
    debug(params)
    debug(result)
    return result.Item ? result.Item : Promise.reject(new Error('(getResource): Resource could not be found'))
  })
}

/**
 * Put a resource in the DB
 * The params given match graphql's param object layout and context
 */
const putResource = params => {
  debug(params)
  return docClient.put(params).promise()
}

/**
 * Update a resource in the DB
 * The params given match graphq's param object layout and context
 */
const updateResource = params => {
  const expression = expressionBuilder(params)
  debug(expression)
  return docClient.update(expression).promise()
}

/**
 * Query a list from the DB
 */
const query = params => {
  return docClient.query(params).promise()
}

/**
 * Scan a list from the DB (full scan)
 */
const scan = params => {
  return docClient.scan(params).promise()
}

/**
 * Delete a resource in the DB
 * The params given match graphq's param object layout and context
 */
const deleteResource = (table, params, context) => {

}

export default {
  setDoc,
  getResource,
  putResource,
  updateResource,
  query,
  scan,
  deleteResource
}
