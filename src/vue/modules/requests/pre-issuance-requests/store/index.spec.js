import { mutations, getters, actions } from './index'
import { types } from './types'

import { Wallet } from '@tokend/js-sdk'

import { PreIssuanceRequest } from '../wrappers/pre-issuance-request'
import * as Api from '../_api'

describe('pre-issuance-requests.module', () => {
  const accountId = 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ'
  const requests = [
    {
      id: '1',
      stateI: 1,
    },
    {
      id: '2',
      stateI: 3,
    },
  ]

  describe('mutations', () => {
    it('SET_ACCOUNT_ID should properly modify state', () => {
      const state = {
        accountId: '',
      }

      mutations[types.SET_ACCOUNT_ID](state, accountId)

      expect(state).to.deep.equal({
        accountId,
      })
    })

    it('SET_PRE_ISSUANCE_REQUESTS should properly modify state', () => {
      const state = {
        preIssuanceRequests: [],
      }

      mutations[types.SET_PRE_ISSUANCE_REQUESTS](state, requests)

      expect(state).to.deep.equal({
        preIssuanceRequests: requests,
      })
    })

    it('CONCAT_PRE_ISSUANCE_REQUESTS should properly modify state', () => {
      const state = {
        preIssuanceRequests: requests,
      }

      mutations[types.CONCAT_PRE_ISSUANCE_REQUESTS](state, requests)

      expect(state).to.deep.equal({
        preIssuanceRequests: requests.concat(requests),
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

    describe('LOAD_PRE_ISSUANCE_REQUESTS', () => {
      it('calls Api.getWithSignature method with provided params', async () => {
        const expectedParams = {
          page: {
            order: 'desc',
          },
          filter: {
            requestor: accountId,
          },
          include: ['request_details'],
        }

        sinon.stub(Api.api(), 'getWithSignature').resolves()

        await actions[types.LOAD_PRE_ISSUANCE_REQUESTS]({
          getters: { accountId },
        })

        expect(Api.api().getWithSignature)
          .to.have.been.calledOnceWithExactly(
            '/v3/create_pre_issuance_requests',
            expectedParams
          )

        Api.api().getWithSignature.restore()
      })
    })
  })

  describe('getters', () => {
    it('accountId', () => {
      const state = { accountId }

      expect(getters[types.accountId](state))
        .to.equal(accountId)
    })

    it('preIssuanceRequests', () => {
      const state = { preIssuanceRequests: requests }

      expect(getters[types.preIssuanceRequests](state))
        .to.deep.equal(requests.map(r => new PreIssuanceRequest(r)))
    })
  })
})
