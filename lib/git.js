// repoinf <https://github.com/msikma/repoinf>
// © MIT license

const path = require('path')
const fs = require('fs').promises
const {exec} = require('./util/exec')
const {fileExists} = require('./util/access')
const {formatOutput} = require('./util/format')

/** List of Git commands used to get information about a repo. */
const gitCommands = {
  branch: [`describe --all`, out => out.replace(/heads\//, '')],
  hash: [`rev-parse --short head`],
  hashFull: [`rev-parse head`],
  commits: [`rev-list head --count`, out => parseInt(out, 10)],
  lastCommit: [`log -n 1 --date=rfc2822 --pretty=format:%cd`, out => new Date(out)]
}

/** Set of formatted values created from the data. */
const gitFormattedValues = {
  versionDashed: ({ branch, hash, commits }) => `${branch}-${commits}-${hash}`,
  version: ({ branch, hash, commits }) => `${branch}-${commits} [${hash}]`
}

/** Empty result set for a repo that has no commits yet. */
const emptyResultSet = {
  commits: 0,
  hash: '0'.repeat(7),
  hashFull: '0'.repeat(40)
}

/**
 * Returns repo information for a given directory.
 * 
 * Note that this function expects to be passed a directory which *contains* a .git directory,
 * not one which *is* a .git directory. If it's desirable to directly pass a .git directory path,
 * set 'isContainer' to false.
 * 
 * By default it's expected that the 'git' command is available and on the path.
 * 
 * Returns an object of repository information.
 */
const getRepoInfo = async (repoRoot, isContainer = true, gitCmd = 'git', commands = gitCommands, formattedValues = gitFormattedValues) => {
  const gitRoot = isContainer ? path.join(repoRoot, '.git') : repoRoot
  const isRepo = await isGitRepo(gitRoot)
  const hasCommits = await repoHasCommits(gitRoot)
  const data = await runRepoCommands(gitRoot, gitCmd, commands, isRepo, hasCommits)
  const formatted = formatOutput(data, formattedValues)
  return {
    isRepo,
    hasCommits,
    ...data,
    ...formatted
  }
}

/**
 * Returns a Git command, as an array, to pass into exec().
 */
const makeGitCommand = (gitCmd, gitRoot, command) => {
  return `${gitCmd} --git-dir ${gitRoot} ${command}`.split(' ')
}

/**
 * Runs the commands needed to get repo information and returns an object of data.
 */
const runRepoCommands = async (gitRoot, gitCmd, commands, isRepo, hasCommits) => {
  // Return null if this is not a valid repo.
  if (!isRepo) return null
  
  // Return all entries as null if we don't have commits, except for the branch name which we can get from the index file.
  if (!hasCommits) {
    const data = Object.fromEntries(Object.entries(commands).map(([name]) => [name, null]))
    return {...data, ...emptyResultSet, branch: await repoHeadBranch(gitRoot)}
  }

  // If this is a valid repo with commits, run our commands.
  const data = await Promise.all(Object.entries(commands).map(
    async ([name, cmd]) => [name, processResult(await exec(makeGitCommand(gitCmd, gitRoot, cmd[0]), 'utf8'), cmd[1])]
  ))
  return Object.fromEntries(data)
}

/**
 * Passes the result through a function, if one is defined.
 */
const processResult = (result, wrapFn) => {
  if (result.code !== 0) {
    return null
  }
  const resultOut = result.stdout.trim()
  if (!wrapFn) return resultOut
  return wrapFn(resultOut)
}

/**
 * Runs a quick check to see if a directory is a Git repo.
 */
const isGitRepo = gitRoot => {
  return fileExists(path.join(gitRoot, 'HEAD'))
}

/**
 * Runs a quick check to see if any commits exist (an "index" file is present after any commit).
 */
const repoHasCommits = gitRoot => {
  return fileExists(path.join(gitRoot, 'index'))
}

/**
 * Returns the contents of the repo HEAD file.
 * 
 * This is only called when a repo exists but has no commits yet.
 */
const repoHeadBranch = async gitRoot => {
  // The raw content of the file is something like "ref: refs/heads/main".
  const content = await fs.readFile(path.join(gitRoot, 'HEAD'), 'utf8')
  const branch = content.match(/refs\/heads\/([^\s]*)/)
  return branch[1].trim()
}

module.exports = {
  getRepoInfo,
  gitCommands,
  gitFormattedValues
}
