/**
 * Module for making dynamodb expressions easier to build
 */

// character used to prepend the attribute variables
const prechar = ':'

const expression = ({ expressions, values }) => ({
  SET(items) {
    expressions.push('SET ' + Object.keys(items).map(key => {
      const attrKey = prechar + key
      values[attrKey] = items[key]
      return `key=${attrKey}`
    }).join(','))
  },
  build() {
    return {
      UpdateExpression: state.expressions.join(','),
      ExpressionAttributeValues: values
    }
  }
})

export default () => expression({
  expressions: [],
  values: {}
})
