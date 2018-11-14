'use strict'
const path = require('path')

const assetsPath = function (_path) {
  return path.posix.join('static', _path)
}

module.exports = {
  assetsPath: assetsPath
}
