[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) [![npm version](https://badge.fury.io/js/repoinf.svg)](https://badge.fury.io/js/repoinf) [![dependencies: 0](https://img.shields.io/badge/dependencies-0-informational)](https://www.npmjs.com/package/repoinf)


# repoinf

Library for getting basic information about a Git repository for versioning purposes.

## Usage

This library is available via npm:

```
npm i --save repoinf
```

Two functions are available: `getRepoInfo()`, which returns information about a repository, and `getPlatformInfo()`, which returns some basic information about the system. Both return a `Promise` that resolves to an object.

To use `getRepoInfo()`, the `git` command line utility needs to be available.

## Reference

**Function:**

```js
getRepoInfo(repoRoot[, isContainer, gitCmd])
```

**Parameters:**

* `repoRoot` **String**
  Path to the repository to return information for.
* `isContainer` **Boolean**: *true*
  Whether the `repoRoot` path *contains* the **.git** directory (as opposed to *being* the **.git** directory).
* `gitCmd` **String**: *"git"*
  Name of or path to the Git executable, if it's not `"git"`.

**Returns:**

* `isRepo` **Boolean**
  Whether the given path is a valid repository. If not, only `isRepo` and `hasCommits` will be returned, both **false**.
* `hasCommits` **Boolean**
  Whether the repository has any commits. Without commits, only the branch name can be determined and all other data is empty.
* `branch` **String**
  Name of the currently active branch.
* `hash` **String**
  Short 7-character hash.
* `hashFull` **String**
  Full 40-character hash.
* `lastCommit` **Date**
  Date of the last commit.
* `commits` **Number**
  Number of commits on this branch.
* `version` **String**
  Formatted string representing the repository's state, e.g. `"main-423 [97a65b1]"`.
* `versionDashed` **String**
  Formatted string separated only by dashes, e.g. `"main-423-97a65b1"`.

**Example:**

```js
const data = await getRepoInfo(`/path/to/project`) // path containing a .git directory
console.log(data)
// {
//   isRepo: true,
//   hasCommits: true,
//   branch: 'main',
//   hash: '97a65b1',
//   hashFull: '97a65b155b21b334975736d70d5eb20e58003cb1',
//   commits: 423,
//   lastCommit: 2021-11-14T14:11:53.000Z,
//   versionDashed: 'main-423-97a65b1',
//   version: 'main-423 [97a65b1]'
// }
```

----

**Function:**

```js
getPlatformInfo()
```

**Parameters:**

* (None.)

**Returns:**

* `version` **String**
  Full string identifying the kernel version.
* `uptime` **Number**
  Number of seconds that the system has been up.
* `platform` **String**
  OS platform name (`aix`, `darwin`, `freebsd`, `linux`, `openbsd`, `sunos`, or `win32`).
* `type` **String**
  OS name (`Linux`, `Darwin` or `Windows_NT`).
* `release` **String**
  OS version.
* `hostname` **String**
  System hostname.
* `arch` **String**
  CPU architecture for which Node was compiled.
* `bootTime` **Date**
  Date object based on the current time and `uptime`.

**Example:**

```js
const data = await getPlatformInfo()
console.log(data)
// {
//   version: 'Darwin Kernel Version 18.7.0: Tue Aug 20 16:57:14 PDT 2019; root:xnu-4903.271.2~2/RELEASE_X86_64',
//   uptime: 23457,
//   platform: 'darwin',
//   type: 'Darwin',
//   release: '18.7.0',
//   hostname: 'Vesuvius.local',
//   arch: 'x64',
//   bootTime: 2021-12-10T10:52:15.000Z
// }
```

## License

© MIT license.
