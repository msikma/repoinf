// repoinf <https://github.com/msikma/repoinf>
// © MIT license

const os = require('os')
const {formatOutput} = require('./util/format')

/** List of functions on the os module we would like to use. */
const osMethods = ['version', 'uptime', 'platform', 'type', 'release', 'hostname', 'arch']

/** Set of formatted values created from the data. */
const osFormattedValues = {
  bootTime: ({ uptime }) => {
    const now = Math.floor((+new Date()) / 1000) * 1000
    return new Date(now - (uptime * 1000))
  }
}

/**
 * Returns platform information.
 */
const getPlatformInfo = (methods = osMethods, formattedValues = osFormattedValues) => {
  const data = Object.fromEntries(methods.map(method => [method, os[method]()]))
  const formatted = formatOutput(data, formattedValues)
  return {
    ...data,
    ...formatted
  }
}

module.exports = {
  getPlatformInfo,
  osMethods,
  osFormattedValues
}
