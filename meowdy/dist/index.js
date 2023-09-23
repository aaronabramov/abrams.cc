
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./meowdy.cjs.production.min.js')
} else {
  module.exports = require('./meowdy.cjs.development.js')
}
