/**
 * Common validation functions
 * Mostly wrapped versions of node-validator with error strings
 */
import {
  isLength as _isLength,
  matches as _matches,
  isAlphanumeric as _isAlphanumeric,
  isURL as _isURL
} from 'validator'

// convenience error func
const errReject = (key, str, msg) =>
  Promise.reject(new Error(`(${key}: ${str}) - ${msg}`))

// convenience function for transforming resolve into arg resolve
const argTransform = fn => (root, args, context, { arg }) =>
  fn(arg, args[arg])

/**
 * Check length of string
 */
const isLength = (min, max, options = {}) => argTransform((key, val) => {
  if(!_isLength(val, { min, max, ...options })){
    return errReject(key, val, `Invalid length. Must be between ${min} and ${max} characters.`)
  }
})

/**
 * Check for regex match for string
 */
const matches = (regex, mod) => argTransform((key, val) => {
  if(!_matches(val, regex, mod)){
    return errReject(key, val, `Invalid string. Must mutch regular expression: ${regex}.`)
  }
})

/**
 * Check if string is alphanumeric
 **/
const isAlphanumeric = locale => argTransform((key, val) => {
  if(!_isAlphanumeric(val, locale)){
    return errReject(key, val, 'String must be contain only letters and numbers')
  }
})

/**
 * Check is string is a valid URL
 **/
const isURL = options => argTransform((key, val) => {
  if(!_isURL(val, options)){
    return errReject(key, val, 'String must be a valid URL.')
  }
})

/**
 * Check if string is valid slug
 */
const isSlug = matches(/^[\w\d]+(?:-[\w\d]+)*$/)

/**
 * check if number is in a particular range
 */
const range = (min, max) => argTransform((key, val) => {
  if(val < min || val > max) {
    return errReject(key, val, `Value must be in the inclusive range of ${min}-${max}`)
  }
})

export {
  isLength,
  matches,
  isAlphanumeric,
  isURL,
  isSlug,
  range
}
