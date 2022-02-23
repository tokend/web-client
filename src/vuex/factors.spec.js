import { MockWrapper } from '../test'
import { mutations, actions, getters } from './factors.module'
import { vuexTypes } from './types'
import factorsJSON from '../test/mocks/factors'
import { api } from '../api'

describe('factors.module', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('mutations', () => {
    let state
    beforeEach(() => {
      state = {
        factors: [],
      }
    })

    it('SET_FACTORS should properly modify state', () => {
      const factors = [
        { id: '1', resourceType: 'email' },
        { id: '2', resourceType: 'totp' },
      ]

      mutations[vuexTypes.SET_FACTORS](state, factors)

      expect(state).to.deep.equal({ factors })
    })
  })

  describe('actions', () => {
    let store

    beforeEach(() => {
      store = {
        state: {},
        getters: {},
        rootGetters: {},
        commit: sinon.stub(),
        dispatch: sinon.stub(),
      }
    })

    it('LOAD_FACTORS should commit the proper set of mutations', async () => {
      sinon.stub(api, 'getWithSignature').resolves(
        MockWrapper.makeJsonapiResponse(factorsJSON),
      )

      const expectedMutations = {
        [vuexTypes.SET_FACTORS]: MockWrapper
          .makeJsonapiResponseData(factorsJSON),
      }

      await actions[vuexTypes.LOAD_FACTORS](store)

      expect(store.commit.args)
        .to
        .deep
        .equal(Object.entries(expectedMutations))
    })
  })

  describe('getters', () => {
    it('factors', () => {
      const factors = ['a', 'b', 'c']
      const state = { factors }

      expect(getters[vuexTypes.factors](state))
        .to
        .deep
        .equal(factors)
    })

    it('factorsTotp', () => {
      const state = {
        factors: [
          { 'type': 'password', 'id': 652, 'priority': 1 },
          { 'type': 'totp', 'id': 991, 'priority': 1 },
        ],
      }
      const expectedResult = [
        { 'type': 'totp', 'id': 991, 'priority': 1 },
      ]

      expect(getters[vuexTypes.factorsTotp](state))
        .to
        .deep
        .equal(expectedResult)
    })

    it('factorsPassword', () => {
      const state = {
        factors: [
          { 'type': 'password', 'id': 652, 'priority': 1 },
          { 'type': 'totp', 'id': 991, 'priority': 1 },
        ],
      }
      const expectedResult = [
        { 'type': 'password', 'id': 652, 'priority': 1 },
      ]

      expect(getters[vuexTypes.factorsPassword](state))
        .to
        .deep
        .equal(expectedResult)
    })

    it('factorsEmail', () => {
      const state = {
        factors: [
          { 'type': 'email', 'id': 785, 'priority': 1 },
          { 'type': 'password', 'id': 652, 'priority': 1 },
          { 'type': 'totp', 'id': 991, 'priority': 1 },
        ],
      }
      const expectedResult = [
        { 'type': 'email', 'id': 785, 'priority': 1 },
      ]

      expect(getters[vuexTypes.factorsEmail](state))
        .to
        .deep
        .equal(expectedResult)
    })

    it('factorsTotpEnabled', () => {
      const factorTotpEnabled = {
        'type': 'totp',
        'id': 991,
        'priority': 1,
      }
      const factorTotpDisabled = {
        'type': 'totp',
        'id': 991,
        'priority': 0,
      }

      let _getters = { factorsTotp: [factorTotpEnabled] }
      expect(getters[vuexTypes.factorsTotpEnabled]({}, _getters))
        .to
        .deep
        .equal([factorTotpEnabled])

      _getters = { factorsTotp: [factorTotpDisabled] }
      expect(getters[vuexTypes.factorsTotpEnabled]({}, _getters))
        .to
        .deep
        .equal([])
    })

    it('isTotpEnabled', () => {
      let _getters

      _getters = {
        factorsTotpEnabled: [
          { 'type': 'totp', 'id': 991, 'priority': 1 },
        ],
      }
      expect(getters[vuexTypes.isTotpEnabled]({}, _getters))
        .to
        .equal(true)

      _getters = {
        factorsTotpEnabled: [],
      }
      expect(getters[vuexTypes.isTotpEnabled]({}, _getters))
        .to
        .equal(false)
    })
  })
})
