/**
 * Module for making dynamodb expressions easier to build
 */
import debugCreator from 'debug'

const debug = debugCreator('churnapi:expressions')

// character used to prepend the attribute variables
const prechar = ':'

// param keys automatically brought across
const paramKeys = ['TableName', 'Key', 'ConditionExpression', 'ReturnValues']

const compileExpressions = (name, items, expressions, values, expFunc) => {
  const updateName = expAliases[name] || name
  if(!expressions[updateName]){
    expressions[updateName] = []
  }
  expressions[updateName].push(Object.keys(items).map((key, i) => {
    const valueKey = prechar + name + i
    if(items[key] != null){
      values[valueKey] = items[key]
    }
    return expFunc(key, valueKey)
  }).join(', '))
}

// list of conversion logic for dynamo expression keys
const expFuncs = {
  SET: (key, valueKey) => `${key}=${valueKey}`,
  ADD: (key, valueKey) => `${key} ${valueKey}`,
  LIST_FRONT: (key, valueKey) => `${key}=list_append(${valueKey}, if_not_exists(${key}, :empty_list))`,
  LIST_REMOVE: (key, valueKey) => `${key}`
}

const expAliases = {
  LIST_FRONT: 'SET',
  LIST_REMOVE: 'REMOVE'
}

export default params => {

  // setup the initial param object
  const output = {}
  paramKeys.forEach(k => { if(params[k]){ output[k] = params[k] } })

  // build the update expression
  const expressions = {}, values = {}
  Object.keys(expFuncs).forEach(k => {
    if(params[k]){
      compileExpressions(k, params[k], expressions, values, expFuncs[k])
    }
  })

  // add common values used with the custom types
  if(params.LIST_FRONT){
    values[':empty_list'] = []
  }

  // finally compile the expressions into their appropriate strings/values
  output.UpdateExpression = Object.keys(expressions).map(exps => {
    return `${exps} ${expressions[exps].join(', ')}`
  }).join(' ')
  if(Object.keys(values).length > 0){
    output.ExpressionAttributeValues = values
  }  

  debug(output)
  return output
}

// Helper function for flattening objects into key value top level pairs
const flatten = (obj, output = {}, prefix = '') => {
  Object.keys(obj).forEach(k => {
    const val = obj[k]
    const newPrefix = prefix.length > 0 ? prefix + '.' + k : k
    if(val !== null && typeof val === 'object'){
      flatten(obj[k], output, newPrefix)
    }else{
      output[newPrefix] = val
    }
  })
  return output
}

export {
  flatten
}
