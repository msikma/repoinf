// repoinf <https://github.com/msikma/repoinf>
// © MIT license

const {spawn} = require('child_process')

/** Encodes a buffer into a string, if an encoding is specified. */
const encode = (buffer, encoding) => {
  if (encoding) {
    return buffer.toString(encoding)
  }
  return buffer
}

/**
 * Runs an external command and returns an object with the result and an exit code.
 * 
 * The result is decoded into a string if an encoding is specified, or returned as a Buffer otherwise.
 * Output is split into stdout and stderr, with an additional stdall containing both of them interlaced.
 */
const exec = (cmd, encoding = null, opts = {}) => new Promise((resolve, reject) => {
  const proc = spawn(cmd.slice(0, 1)[0], cmd.slice(1), opts)

  const output = {
    stdout: [],
    stderr: [],
    stdall: [],
    code: null,
    signal: null,
    error: null
  }

  /** Returns the final state of the output; called when exiting. */
  const finalize = () => {
    return {
      ...output,
      stdout: encode(Buffer.concat(output.stdout), encoding),
      stderr: encode(Buffer.concat(output.stderr), encoding),
      stdall: encode(Buffer.concat(output.stdall), encoding)
    }
  }

  proc.stdout.on('data', (data) => {
    output.stdout.push(data)
    output.stdall.push(data)
  })

  proc.stderr.on('data', (data) => {
    output.stderr.push(data)
    output.stdall.push(data)
  })

  proc.on('close', (code, signal) => {
    output.code = code
    output.signal = signal
    return resolve(finalize())
  })

  proc.on('error', (err) => {
    output.error = err
    return reject(finalize())
  })
})

module.exports = {
  exec
}
