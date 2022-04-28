require('jsdom-global')('', { url: 'http://localhost' })
const chai = require('chai')
chai.use(require('sinon-chai'))

global.expect = chai.expect
global.localStorage = window.localStorage
global.sinon = require('sinon')
