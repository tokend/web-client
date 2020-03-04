require('jsdom-global')('', { url: 'http://localhost' })

global.localStorage = window.localStorage
global.sinon = require('sinon')

const chai = require('chai')
global.expect = chai.expect
chai.use(require('sinon-chai'))
