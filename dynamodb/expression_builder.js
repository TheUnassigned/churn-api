/**
 * Module for making dynamodb expressions easier to build
 */

// character used to prepend the attribute variables
const prechar = ':'

// param keys automatically brought across
const paramKeys = ['TableName', 'Key', 'ConditionExpression', 'ReturnValues']

// gets a mapping of all object leaves and their values
const getLeaves = (obj, output = [], prefix = '') => {
  Object.keys(obj).forEach(k => {
    const val = obj[k]
    const newPrefix = prefix.length > 0 ? prefix + '.' + k : k
    if(val !== null && typeof val === 'object'){
      getLeaves(obj[k], output, newPrefix)
    }else{
      output.push({ key: newPrefix, value: val })
    }
  })
  return output
}

// list of conversion logic for dynamo expression keys
const expFuncs = {
  SET: (items, expressions, values) => {
    expressions.push('SET ' + getLeaves(items).map(({ key, value }, i) => {
      // create a unique dynamo friendly attribute key
      const attrKey = prechar + 'SET' + i
      values[attrKey] = value
      return `${key}=${attrKey}`
    }).join(', '))
  }
}

export default params => {

  // setup the initial param object
  const output = {}
  paramKeys.forEach(k => { if(params[k]){ output[k] = params[k] } })

  // build the update expression
  const expressions = [], values = {}
  Object.keys(expFuncs).forEach(k => {
    if(params[k]){ expFuncs[k](params[k], expressions, values) }
  })

  // set the final parts of the param object
  output.UpdateExpression = expressions.join(' ')
  output.ExpressionAttributeValues = values

  return output
}
