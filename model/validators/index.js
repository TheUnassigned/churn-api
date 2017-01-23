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
const errReject = (key, str, msg) => Promise.reject(new Error(`(${key}: ${str}) - ${msg}`))

/**
 * Check length of string
 */
const isLength = (min, max, options = {}) => {
  return (key, str) => {
    if(!_isLength(str, { min, max, ...options })){
      return errReject(key, str, `Invalid length. Must be between ${min} and ${max} characters.`)
    }
  }
}

/**
 * Check for regex match for string
 */
const matches = (regex, mod) => {
  return (key, str) => {
    if(!_matches(str, regex, mod)){
      return errReject(key, str, `Invalid string. Must mutch regular expression: ${regex}.`)
    }
  }
}

/**
 * Check if string is alphanumeric
 **/
const isAlphanumeric = locale => {
  return (key, str) => {
    if(!_isAlphanumeric(str, locale)){
      return errReject(key, str, 'String must be contain only letters and numbers')
    }
  }
}

/**
 * Check is string is a valid URL
 **/
const isURL = options => {
  return (key, str) => {
    if(!_isURL(str, options)){
      return errReject(key, str, 'String must be a valid URL.')
    }
  }
}

export {
  isLength,
  matches,
  isAlphanumeric,
  isURL
}