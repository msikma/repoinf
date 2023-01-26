// repoinf <https://github.com/msikma/repoinf>
// © MIT license

const {getRepoInfo, gitCommands} = require('./git')
const {getPlatformInfo} = require('./platform')

module.exports = {
  getRepoInfo,
  gitCommands,
  getPlatformInfo
}
