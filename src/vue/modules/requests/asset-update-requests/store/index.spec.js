import { mutations, getters, actions } from './index'
import { types } from './types'

import { Wallet, base } from '@tokend/js-sdk'

import { AssetUpdateRequest } from '../wrappers/asset-update-request'

import * as Api from '../_api'

describe('asset-update-requests.module', () => {
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

    it('SET_ASSET_UPDATE_REQUESTS should properly modify state', () => {
      const state = {
        assetUpdateRequests: [],
      }

      mutations[types.SET_ASSET_UPDATE_REQUESTS](state, requests)

      expect(state).to.deep.equal({
        assetUpdateRequests: requests,
      })
    })

    it('CONCAT_ASSET_UPDATE_REQUESTS should properly modify state', () => {
      const state = {
        assetUpdateRequests: requests,
      }

      mutations[types.CONCAT_ASSET_UPDATE_REQUESTS](state, requests)

      expect(state).to.deep.equal({
        assetUpdateRequests: requests.concat(requests),
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

    describe('LOAD_ASSET_UPDATE_REQUESTS', () => {
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

        await actions[types.LOAD_ASSET_UPDATE_REQUESTS]({
          getters: { accountId },
        })

        expect(Api.api().getWithSignature)
          .to.have.been.calledOnceWithExactly(
            '/v3/update_asset_requests',
            expectedParams
          )

        Api.api().getWithSignature.restore()
      })
    })

    describe('CANCEL_ASSET_UPDATE_REQUEST', () => {
      const operation = {
        id: '1',
      }

      beforeEach(() => {
        sinon.stub(base.ManageAssetBuilder, 'cancelAssetRequest')
          .returns(operation)
        sinon.stub(Api.api(), 'postOperations').resolves()
      })

      afterEach(() => {
        base.ManageAssetBuilder.cancelAssetRequest.restore()
        Api.api().postOperations.restore()
      })

      it('calls base.ManageAssetBuilder.cancelAssetRequest with provided params', async () => {
        const requestId = '1'

        await actions[types.CANCEL_ASSET_UPDATE_REQUEST]({}, requestId)

        expect(base.ManageAssetBuilder.cancelAssetRequest)
          .to.have.been.calledOnceWithExactly({
            requestID: requestId,
          })
      })

      it('calls api().postOperations with correct params', async () => {
        await actions[types.CANCEL_ASSET_UPDATE_REQUEST]({}, '')

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

    it('assetUpdateRequests', () => {
      const state = { assetUpdateRequests: requests }

      expect(getters[types.assetUpdateRequests](state))
        .to.deep.equal(requests.map(r => new AssetUpdateRequest(r)))
    })
  })
})
