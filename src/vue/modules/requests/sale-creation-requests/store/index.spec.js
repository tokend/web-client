import { mutations, getters, actions } from './index'
import { types } from './types'

import { Wallet, base } from '@tokend/js-sdk'

import { SaleCreationRequest } from '../wrappers/sale-creation-request'
import { Asset } from '../wrappers/asset'

import * as Api from '../_api'

describe('sale-creation-requests.module', () => {
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
  const assets = [
    {
      id: 'USD',
      owner: {
        id: accountId,
      },
    },
    {
      id: 'BTC',
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

    it('SET_SALE_CREATION_REQUESTS should properly modify state', () => {
      const state = {
        saleCreationRequests: [],
      }

      mutations[types.SET_SALE_CREATION_REQUESTS](state, requests)

      expect(state).to.deep.equal({
        saleCreationRequests: requests,
      })
    })

    it('CONCAT_SALE_CREATION_REQUESTS should properly modify state', () => {
      const state = {
        saleCreationRequests: requests,
      }

      mutations[types.CONCAT_SALE_CREATION_REQUESTS](state, requests)

      expect(state).to.deep.equal({
        saleCreationRequests: requests.concat(requests),
      })
    })

    it('SET_BALANCES_ASSETS should properly modify state', () => {
      const state = {
        balancesAssets: [],
      }

      mutations[types.SET_BALANCES_ASSETS](state, assets)

      expect(state).to.deep.equal({
        balancesAssets: assets,
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

    describe('LOAD_SALE_CREATION_REQUESTS', () => {
      it('calls Api.getWithSignature method with provided params', async () => {
        sinon.stub(Api.api(), 'getWithSignature').resolves()

        await actions[types.LOAD_SALE_CREATION_REQUESTS](
          { getters: { accountId: 'SOME_ACCOUNT_ID' } },
          'USD',
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
                'request_details.base_asset': 'USD',
              },
              include: ['request_details', 'request_details.default_quote_asset'],
            }
          )

        Api.api().getWithSignature.restore()
      })
    })

    describe('LOAD_ACCOUNT_BALANCES', () => {
      const balancesResponse = {
        data: {
          balances: [
            {
              asset: {
                id: 'USD',
              },
            },
            {
              asset: {
                id: 'BTC',
              },
            },
          ],
        },
      }

      beforeEach(() => {
        sinon.stub(Api.api(), 'getWithSignature').resolves(balancesResponse)
      })

      afterEach(() => {
        Api.api().getWithSignature.restore()
      })

      it('calls Api.getWithSignature method with provided params', async () => {
        await actions[types.LOAD_ACCOUNT_BALANCES]({
          getters: { accountId },
          commit: () => {},
        })

        expect(Api.api().getWithSignature)
          .to.have.been.calledOnceWithExactly(
            `/v3/accounts/${accountId}`,
            { include: ['balances.state', 'balances.asset'] },
          )
      })

      it('commits proper set of mutations', async () => {
        const store = {
          state: {},
          getters: { accountId },
          commit: sinon.stub(),
          dispatch: sinon.stub(),
        }

        const expectedAssets = [
          { id: 'USD' },
          { id: 'BTC' },
        ]
        const expectedMutations = {
          [types.SET_BALANCES_ASSETS]: expectedAssets,
        }

        await actions[types.LOAD_ACCOUNT_BALANCES](store)

        expect(store.commit.args)
          .to.deep.equal(Object.entries(expectedMutations))
      })
    })

    describe('CANCEL_SALE_CREATION_REQUEST', () => {
      const operation = {
        id: '1',
      }

      beforeEach(() => {
        sinon.stub(base.SaleRequestBuilder, 'cancelSaleCreationRequest')
          .returns(operation)
        sinon.stub(Api.api(), 'postOperations').resolves()
      })

      afterEach(() => {
        base.SaleRequestBuilder.cancelSaleCreationRequest.restore()
        Api.api().postOperations.restore()
      })

      it('calls base.SaleRequestBuilder.cancelSaleCreationRequest with provided params', async () => {
        const requestId = '1'

        await actions[types.CANCEL_SALE_CREATION_REQUEST]({}, requestId)

        expect(base.SaleRequestBuilder.cancelSaleCreationRequest)
          .to.have.been.calledOnceWithExactly({
            requestID: requestId,
          })
      })

      it('calls api().postOperations with correct params', async () => {
        await actions[types.CANCEL_SALE_CREATION_REQUEST]({}, '')

        expect(Api.api().postOperations)
          .to.have.been.calledOnceWithExactly(operation)
      })
    })
  })

  describe('getters', () => {
    it('accountId', () => {
      const state = { accountId }

      expect(getters[types.accountId](state))
        .to.equal(accountId)
    })

    it('saleCreationRequests', () => {
      const state = { saleCreationRequests: requests }

      expect(getters[types.saleCreationRequests](state))
        .to.deep.equal(requests.map(r => new SaleCreationRequest(r)))
    })

    it('accountOwnedAssets', () => {
      const state = {
        balancesAssets: assets,
        accountId,
      }
      const expectedAssets = [
        new Asset({
          id: 'USD',
          owner: {
            id: accountId,
          },
        }),
      ]

      expect(getters[types.accountOwnedAssets](state))
        .to.deep.equal(expectedAssets)
    })
  })
})
