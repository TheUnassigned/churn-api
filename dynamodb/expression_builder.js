/**
 * Module for making dynamodb expressions easier to build
 */

const expression = (state) => ({
  SET(items) {
    let set = 'SET '
    Object.keys(items).forEach(key => {
      set += `key=:${key}`
      state.ExpressionAttributeValues[key] = items[key]
    })
    state[name] = Object.keys(items).reduce((obj, item) => {

    }, {})
  },
  build() {
    return state
  }
})

export default () => expression({
  UpdateExpression: '',
  ExpressionAttributeValues: {}
})