import { mutations, getters, actions } from './index'
import { types } from './types'

import { Wallet } from '@tokend/js-sdk'

import { PreIssuanceRequest } from '../wrappers/pre-issuance-request'

import * as Api from '../_api'

describe('pre-issuance-requests.module', () => {
  describe('mutations', () => {
    it('SET_ACCOUNT_ID should properly modify state', () => {
      const state = {
        accountId: '',
      }

      mutations[types.SET_ACCOUNT_ID](state, 'SOME_ACCOUNT_ID')

      expect(state).to.deep.equal({
        accountId: 'SOME_ACCOUNT_ID',
      })
    })

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
    const wallet = new Wallet(
      'test@mail.com',
      'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
      'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
      '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
    )
    const config = {
      horizonURL: 'https://test.api.com',
    }

    beforeEach(() => {
      Api.initApi(wallet, config)
    })

    describe('LOAD_REQUESTS', () => {
      it('calls Api.getWithSignature method with provided params', async () => {
        sinon.stub(Api.api(), 'getWithSignature').resolves()

        await actions[types.LOAD_REQUESTS]({
          getters: { accountId: 'SOME_ACCOUNT_ID' },
        })

        expect(Api.api().getWithSignature)
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

        Api.api().getWithSignature.restore()
      })
    })
  })

  describe('getters', () => {
    it('accountId', () => {
      const state = { accountId: 'SOME_ACCOUNT_ID' }

      expect(getters[types.accountId](state))
        .to.equal('SOME_ACCOUNT_ID')
    })

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
