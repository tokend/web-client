import { mutations, getters, actions } from './index'
import { types } from './types'

import { Wallet, base } from '@tokend/js-sdk'

import { IncomingWithdrawalRequest } from '../wrappers/incoming-withdrawal-request'

import * as Api from '../_api'

describe('incoming-withdrawals-requests.module', () => {
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
            '/v3/create_withdraw_requests',
            {
              page: {
                order: 'desc',
              },
              filter: {
                reviewer: 'SOME_ACCOUNT_ID',
              },
              include: ['request_details', 'request_details.balance'],
            }
          )

        Api.api().getWithSignature.restore()
      })
    })

    describe('APPROVE_REQUEST', () => {
      beforeEach(() => {
        sinon.stub(Api.api(), 'postOperations').resolves()
        sinon.stub(base.ReviewRequestBuilder, 'reviewWithdrawRequest')
      })

      afterEach(() => {
        Api.api().postOperations.restore()
        base.ReviewRequestBuilder.reviewWithdrawRequest.restore()
      })

      it('calls base.ReviewRequestBuilder.reviewWithdrawRequest with provided params', async () => {
        await actions[types.APPROVE_REQUEST]({}, {
          id: 'REQUEST_ID',
          hash: 'REQUEST_HASH',
          typeI: 1,
          pendingTasks: 1024,
        })

        expect(base.ReviewRequestBuilder.reviewWithdrawRequest)
          .to.have.been.calledOnceWithExactly({
            requestID: 'REQUEST_ID',
            requestHash: 'REQUEST_HASH',
            requestType: 1,
            reviewDetails: {
              tasksToAdd: 0,
              tasksToRemove: 1024,
              externalDetails: {},
            },
            requestDetails: '{"tasksToAdd":0,"tasksToRemove":1024,"externalDetails":{}}',
            action: base.xdr.ReviewRequestOpAction.approve().value,
            reason: '',
          })
      })

      it('calls api().postOperations', async () => {
        await actions[types.APPROVE_REQUEST]({}, {})

        expect(Api.api().postOperations).to.have.been.calledOnce
      })
    })

    describe('REJECT_REQUEST', () => {
      beforeEach(() => {
        sinon.stub(Api.api(), 'postOperations').resolves()
        sinon.stub(base.ReviewRequestBuilder, 'reviewWithdrawRequest')
      })

      afterEach(() => {
        Api.api().postOperations.restore()
        base.ReviewRequestBuilder.reviewWithdrawRequest.restore()
      })

      it('calls base.ReviewRequestBuilder.reviewWithdrawRequest with provided params', async () => {
        await actions[types.REJECT_REQUEST]({}, {
          request: {
            id: 'REQUEST_ID',
            hash: 'REQUEST_HASH',
            typeI: 1,
            pendingTasks: 1024,
          },
          reason: 'Some reason',
        })

        expect(base.ReviewRequestBuilder.reviewWithdrawRequest)
          .to.have.been.calledOnceWithExactly({
            requestID: 'REQUEST_ID',
            requestHash: 'REQUEST_HASH',
            requestType: 1,
            reviewDetails: {
              tasksToAdd: 0,
              tasksToRemove: 1024,
              externalDetails: {},
            },
            requestDetails: '{"tasksToAdd":0,"tasksToRemove":1024,"externalDetails":{}}',
            action: base.xdr.ReviewRequestOpAction.permanentReject().value,
            reason: 'Some reason',
          })
      })

      it('calls api().postOperations', async () => {
        await actions[types.REJECT_REQUEST]({}, { request: {}, reason: '' })

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
          new IncomingWithdrawalRequest({ id: '1' }),
          new IncomingWithdrawalRequest({ id: '2' }),
        ])
    })
  })
})
