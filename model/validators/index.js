/**
 * Common validation functions
 * Mostly wrapped versions of node-validator with error strings
 */
import {
  isLength as _isLength,
  matches as _matches,
  isAlphanumeric as _isAlphanumeric
} from 'validator'

/**
 * Check length of string
 */
const isLength = (min, max, options = {}) => {
  return str => {
    if(!_isLength(str, { min, max, ...options })){
      return Promise.reject(new Error(`Invalid length. Must be between ${min} and ${max} characters.`))
    }
  }
}

/**
 * Check for regex match for string
 */
const matches = (regex, mod) => {
  return str => {
    if(!_matches(str, regex, mod)){
      return Promise.reject(new Error(`Invalid string. Must mutch regular expression: ${regex}.`))
    }
  }
}

/**
 * Check if string is alphanumeric
 **/
const isAlphanumeric = locale => {
  return str => {
    if(!_isAlphanumeric(str, locale)){
      return Promise.reject(new Error('String must be contain only letters and numbers'))
    }
  }
}

/**
 * Check is string is a valid URL
 **/
const isURL = options => {
  return str => {
    if(!_isURL(str, options)){
      return Promise.reject(new Error('String must be a valid URL.'))
    }
  }
}

export {
  isLength,
  matches,
  isAlphanumeric,
  isURL
}