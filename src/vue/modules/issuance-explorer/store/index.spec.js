import { mutations, getters, actions } from './index'
import { types } from './types'

import { Wallet } from '@tokend/js-sdk'

import { IssuanceRequest } from '../wrappers/issuance'

import * as Api from '@/api'

describe('issuance-explorer.module', () => {
  const accountId = 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ'
  const issuances = [
    {
      id: '1',
      amount: '100.000000',
    },
    {
      id: '2',
      amount: '50.000000',
    },
  ]

  describe('mutations', () => {
    it('SET_ISSUANCES should properly modify state', () => {
      const state = {
        issuances: [],
      }

      mutations[types.SET_ISSUANCES](state, issuances)

      expect(state).to.deep.equal({
        issuances,
      })
    })

    it('CONCAT_ISSUANCES should properly modify state', () => {
      const state = {
        issuances,
      }

      mutations[types.CONCAT_ISSUANCES](state, issuances)

      expect(state).to.deep.equal({
        issuances: issuances.concat(issuances),
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

    describe('LOAD_ISSUANCES', () => {
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

        await actions[types.LOAD_ISSUANCES]({ rootGetters: { accountId } })

        expect(Api.api().getWithSignature)
          .to.have.been.calledOnceWithExactly(
            '/v3/create_issuance_requests',
            expectedParams
          )

        Api.api().getWithSignature.restore()
      })
    })
  })

  describe('getters', () => {
    it('issuances', () => {
      const state = { issuances }

      expect(getters[types.issuances](state))
        .to.deep.equal(issuances.map(i => new IssuanceRequest(i)))
    })
  })
})
