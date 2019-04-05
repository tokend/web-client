import { mutations, getters, actions } from './index'
import { types } from './types'

import { Wallet, base } from '@tokend/js-sdk'

import { CreateSaleRequest } from '../wrappers/create-sale-request'

import * as Api from '../_api'

describe('create-sale-requests.module', () => {
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

      mutations[types.SET_REQUESTS](state, [
        { id: '1' },
        { id: '2' },
      ])

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

      mutations[types.CONCAT_REQUESTS](state, [
        { id: '3' },
        { id: '4' },
      ])

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

        await actions[types.LOAD_REQUESTS](
          { getters: { accountId: 'SOME_ACCOUNT_ID' } }
        )

        expect(Api.api().getWithSignature)
          .to.have.been.calledOnceWithExactly(
            '/v3/create_sale_requests',
            {
              page: {
                order: 'desc',
              },
              filter: {
                requestor: 'SOME_ACCOUNT_ID',
              },
              include: ['request_details', 'request_details.default_quote_asset'],
            }
          )

        Api.api().getWithSignature.restore()
      })
    })

    describe('CANCEL_REQUEST', () => {
      beforeEach(() => {
        sinon.stub(Api.api(), 'postOperations').resolves()
      })

      afterEach(() => {
        Api.api().postOperations.restore()
      })

      it('calls base.SaleRequestBuilder.cancelSaleCreationRequest with provided params', async () => {
        sinon.stub(base.SaleRequestBuilder, 'cancelSaleCreationRequest')

        await actions[types.CANCEL_REQUEST]({}, '1')

        expect(base.SaleRequestBuilder.cancelSaleCreationRequest)
          .to.have.been.calledOnceWithExactly({
            requestID: '1',
          })

        base.SaleRequestBuilder.cancelSaleCreationRequest.restore()
      })

      it('calls api().postOperations with correct params', async () => {
        await actions[types.CANCEL_REQUEST]({}, '1')

        expect(Api.api().postOperations).to.have.been.calledOnce
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
          new CreateSaleRequest({ id: '1' }),
          new CreateSaleRequest({ id: '2' }),
        ])
    })
  })
})
