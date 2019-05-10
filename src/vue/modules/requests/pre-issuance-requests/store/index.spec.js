import {
  preIssuanceRequestsModule,
  mutations,
  getters,
  actions,
} from './index'
import { types } from './types'

import { Wallet } from '@tokend/js-sdk'

import { PreIssuanceRequest } from '../wrappers/pre-issuance-request'

import * as Api from '@/api'

describe('pre-issuance-requests.module', () => {
  describe('vuex types', () => {
    const getModuleKeys = (module) => {
      return Object.keys({
        ...module.actions,
        ...module.mutations,
        ...module.getters,
      })
    }

    it('every entity in module should be mentioned in vuex-types', () => {
      for (const key of getModuleKeys(preIssuanceRequestsModule)) {
        expect(types).to.have.property(key)
      }
    })

    it('every key described in vuex-types should be a real vuex-entity', () => {
      const moduleKeys = [
        ...getModuleKeys(preIssuanceRequestsModule),
      ]

      for (const key of Object.keys(types)) {
        expect(moduleKeys).to.include(key)
      }
    })
  })

  describe('mutations', () => {
    it('SET_REQUESTS should properly modify state', () => {
      const state = {
        requests: [],
      }
      const requests = [
        { id: '1' },
        { id: '2' },
      ]

      mutations[types.SET_REQUESTS](state, requests)

      expect(state).to.deep.equal({
        requests: [
          { id: '1' },
          { id: '2' },
        ],
      })
    })

    it('CONCAT_REQUESTS should properly modify state', () => {
      const state = {
        requests: [
          { id: '1' },
          { id: '2' },
        ],
      }
      const requests = [
        { id: '3' },
        { id: '4' },
      ]

      mutations[types.CONCAT_REQUESTS](state, requests)

      expect(state).to.deep.equal({
        requests: [
          { id: '1' },
          { id: '2' },
          { id: '3' },
          { id: '4' },
        ],
      })
    })
  })

  describe('actions', () => {
    beforeEach(() => {
      const wallet = new Wallet(
        'test@mail.com',
        'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
        'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
        '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
      )
      const config = {
        horizonURL: 'https://test.api.com',
      }

      Api.initApi(wallet, config)
    })

    describe('LOAD_REQUESTS', () => {
      it('calls Api.getWithSignature method with provided params', async () => {
        sinon.stub(Api.api, 'getWithSignature').resolves()

        await actions[types.LOAD_REQUESTS]({
          rootGetters: { accountId: 'SOME_ACCOUNT_ID' },
        })

        expect(Api.api.getWithSignature)
          .to.have.been.calledOnceWithExactly(
            '/v3/create_pre_issuance_requests',
            {
              page: {
                order: 'desc',
              },
              filter: {
                requestor: 'SOME_ACCOUNT_ID',
              },
              include: ['request_details'],
            }
          )

        Api.api.getWithSignature.restore()
      })
    })
  })

  describe('getters', () => {
    it('requests', () => {
      const state = {
        requests: [
          { id: '1' },
          { id: '2' },
        ],
      }

      expect(getters[types.requests](state))
        .to.deep.equal([
          new PreIssuanceRequest({ id: '1' }),
          new PreIssuanceRequest({ id: '2' }),
        ])
    })
  })
})
