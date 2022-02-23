import { api } from '@/api'
import { vuexTypes } from './types'

import factors from './factors.module'

import Vue from 'vue'
import Vuex from 'vuex'
import { MockWrapper } from '@/test'

Vue.use(Vuex)

describe('factors.module end-to-end test', () => {
  describe('LOAD_FACTORS should update all the getters properly', () => {
    const responseDefaultRaw = {
      data: [
        { type: 'email', id: 785, attributes: { priority: 1 } },
        { type: 'password', id: 652, attributes: { priority: 1 } },
        { type: 'totp', id: 991, attributes: { priority: 1 } },
      ],
    }

    const responseDefaultParsed = [
      { type: 'email', id: 785, priority: 1 },
      { type: 'password', id: 652, priority: 1 },
      { type: 'totp', id: 991, priority: 1 },
    ]

    let store

    beforeEach(() => {
      store = new Vuex.Store({
        actions: {},
        getters: {},
        mutations: {},
        state: {},
        modules: { factors },
      })
    })

    afterEach(() => {
      sinon.restore()
    })

    it('factors', async () => {
      sinon.stub(api, 'getWithSignature').resolves(
        MockWrapper.makeJsonapiResponse(responseDefaultRaw),
      )

      await store.dispatch(vuexTypes.LOAD_FACTORS)

      expect(store.getters[vuexTypes.factors])
        .to
        .deep
        .equal(responseDefaultParsed)
    })

    it('factorsTotp', async () => {
      sinon.stub(api, 'getWithSignature').resolves(
        MockWrapper.makeJsonapiResponse(responseDefaultRaw),
      )

      await store.dispatch(vuexTypes.LOAD_FACTORS)

      expect(store.getters[vuexTypes.factorsTotp])
        .to
        .deep
        .equal(responseDefaultParsed.slice(2, 3))
    })

    it('factorsPassword', async () => {
      sinon.stub(api, 'getWithSignature').resolves(
        MockWrapper.makeJsonapiResponse(responseDefaultRaw),
      )

      await store.dispatch(vuexTypes.LOAD_FACTORS)

      expect(store.getters[vuexTypes.factorsPassword])
        .to
        .deep
        .equal(responseDefaultParsed.slice(1, 2))
    })

    it('factorsEmail', async () => {
      sinon.stub(api, 'getWithSignature').resolves(
        MockWrapper.makeJsonapiResponse(responseDefaultRaw),
      )

      await store.dispatch(vuexTypes.LOAD_FACTORS)

      expect(store.getters[vuexTypes.factorsEmail])
        .to
        .deep
        .equal(responseDefaultParsed.slice(0, 1))
    })

    it('factorsTotpEnabled with enabled totp factor', async () => {
      sinon.stub(api, 'getWithSignature').resolves(
        MockWrapper.makeJsonapiResponse({
          data: [
            { type: 'email', id: 785, attributes: { priority: 1 } },
            { type: 'password', id: 652, attributes: { priority: 1 } },
            { type: 'totp', id: 991, attributes: { priority: 1 } },
          ],
        }),
      )

      await store.dispatch(vuexTypes.LOAD_FACTORS)

      expect(store.getters[vuexTypes.factorsTotpEnabled])
        .to
        .deep
        .equal([
          { type: 'totp', id: 991, priority: 1 },
        ])
    })

    it('factorsTotpEnabled when no enabled totp factor', async () => {
      sinon.stub(api, 'getWithSignature').resolves(
        MockWrapper.makeJsonapiResponse({
          data: [
            { type: 'password', id: 652, attributes: { priority: 1 } },
            { type: 'totp', id: 991, attributes: { priority: 0 } },
          ],
        }),
      )

      await store.dispatch(vuexTypes.LOAD_FACTORS)

      expect(store.getters[vuexTypes.factorsTotpEnabled])
        .to
        .deep
        .equal([])
    })

    it('isTotpEnabled with enabled totp factor', async () => {
      sinon.stub(api, 'getWithSignature').resolves(
        MockWrapper.makeJsonapiResponse({
          data: [
            { type: 'email', id: 785, attributes: { priority: 1 } },
            { type: 'password', id: 652, attributes: { priority: 1 } },
            { type: 'totp', id: 991, attributes: { priority: 1 } },
          ],
        }),
      )

      await store.dispatch(vuexTypes.LOAD_FACTORS)

      expect(store.getters[vuexTypes.isTotpEnabled])
        .to
        .equal(true)
    })

    it('isTotpEnabled whe no enabled totp factor', async () => {
      sinon.stub(api, 'getWithSignature').resolves(
        MockWrapper.makeJsonapiResponse({
          data: [
            { type: 'password', id: 652, attributes: { priority: 1 } },
            { type: 'totp', id: 991, attributes: { priority: 0 } },
          ],
        }),
      )

      await store.dispatch(vuexTypes.LOAD_FACTORS)

      expect(store.getters[vuexTypes.isTotpEnabled])
        .to
        .equal(false)
    })
  })
})
