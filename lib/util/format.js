// repoinf <https://github.com/msikma/repoinf>
// © MIT license

/**
 * Creates an object of formatted values from the data obtained from the Git repo.
 */
const formatOutput = (data, formattedValues) => {
  if (!data) return {}
  const values = []
  for (const [name, fn] of Object.entries(formattedValues)) {
    values.push([name, fn(data)])
  }
  return Object.fromEntries(values)
}

module.exports = {
  formatOutput
}
