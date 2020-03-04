require('jsdom-global')('', { url: 'http://localhost' })

global.localStorage = window.localStorage
global.expect = require('chai').expect
global.sinon = require('sinon')
const chai = require('chai')
chai.use(require('sinon-chai'));