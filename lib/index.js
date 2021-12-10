// repoinf <https://github.com/msikma/repoinf>
// © MIT license

const {getRepoInfo, gitCommands, gitFormattedValues} = require('./git')
const {getPlatformInfo, osMethods} = require('./platform')

module.exports = {
  getRepoInfo,
  getPlatformInfo
}
