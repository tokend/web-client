import { MockHelper, MockWrapper } from '../test'
import { mutations, actions, getters } from './factors.module'
import { vuexTypes } from './types'
import factorsJSON from '../test/mocks/factors'

describe('factors.module', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('mutations', () => {
    let state
    beforeEach(() => {
      state = {
        factors: []
      }
    })

    it('SET_FACTORS should properly modify state', () => {
      const factors = [
        { id: '1', resourceType: 'email' },
        { id: '2', resourceType: 'totp' }
      ]

      mutations.SET_FACTORS(state, factors)

      expect(state).to.deep.equal({ factors })
    })
  })

  describe('actions', () => {
    let mockHelper
    let store

    beforeEach(() => {
      mockHelper = new MockHelper()
      store = {
        state: {},
        getters: {},
        commit: sinon.stub(),
        dispatch: sinon.stub()
      }
    })

    it('LOAD_FACTORS should commit the proper set of mutations', async () => {
      mockHelper.mockApiMethod('factors', 'getAll', factorsJSON)

      const expectedMutations = {
        [vuexTypes.SET_FACTORS]: MockWrapper.makeApiResponse(factorsJSON).data
      }

      await actions.LOAD_FACTORS(store)

      expect(store.commit.args).to.deep.equal(Object.entries(expectedMutations))
    })
  })

  describe('getters', () => {
    it('factors', () => {
      const factors = ['a', 'b', 'c']
      const state = { factors }

      expect(getters.factors(state)).to.deep.equal(factors)
    })

    it('factorsTotp', () => {
      const state = {
        factors: [
          { 'resourceType': 'password', 'id': 652, 'priority': 1 },
          { 'resourceType': 'totp', 'id': 991, 'priority': 1 }
        ]
      }
      const expectedResult = [
        { 'resourceType': 'totp', 'id': 991, 'priority': 1 }
      ]

      expect(getters.factorsTotp(state)).to.deep.equal(expectedResult)
    })

    it('factorsPassword', () => {
      const state = {
        factors: [
          { 'resourceType': 'password', 'id': 652, 'priority': 1 },
          { 'resourceType': 'totp', 'id': 991, 'priority': 1 }
        ]
      }
      const expectedResult = [
        { 'resourceType': 'password', 'id': 652, 'priority': 1 }
      ]

      expect(getters.factorsPassword(state)).to.deep.equal(expectedResult)
    })

    it('factorsEmail', () => {
      const state = {
        factors: [
          { 'resourceType': 'email', 'id': 785, 'priority': 1 },
          { 'resourceType': 'password', 'id': 652, 'priority': 1 },
          { 'type': 'totp', 'id': 991, 'priority': 1 }
        ]
      }
      const expectedResult = [
        { 'resourceType': 'email', 'id': 785, 'priority': 1 }
      ]

      expect(getters.factorsEmail(state)).to.deep.equal(expectedResult)
    })

    it('factorsTotpEnabled', () => {
      const factorTotpEnabled = {
        'resourceType': 'totp',
        'id': 991,
        'priority': 1
      }
      const factorTotpDisabled = {
        'resourceType': 'totp',
        'id': 991,
        'priority': 0
      }

      let _getters = { factorsTotp: [factorTotpEnabled] }
      expect(getters.factorsTotpEnabled({}, _getters))
        .to
        .deep
        .equal([factorTotpEnabled])

      _getters = { factorsTotp: [factorTotpDisabled] }
      expect(getters.factorsTotpEnabled({}, _getters))
        .to
        .deep
        .equal([])
    })

    it('isTotpEnabled', () => {
      let _getters

      _getters = {
        factorsTotpEnabled: [
          { 'resourceType': 'totp', 'id': 991, 'priority': 1 }
        ]
      }
      expect(getters.isTotpEnabled({}, _getters)).to.equal(true)

      _getters = {
        factorsTotpEnabled: []
      }
      expect(getters.isTotpEnabled({}, _getters)).to.equal(false)
    })
  })
})
