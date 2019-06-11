import { mutations, getters, actions } from './index'
import { types } from './types'

import { Wallet } from '@tokend/js-sdk'

import { Movement } from '../wrappers/movement'

import { api, useWallet } from '@/api'

describe('movements-history.module', () => {
  describe('mutations', () => {
    it('SET_MOVEMENTS should properly modify state', () => {
      const movements = [
        {
          id: '176093659138',
          balance: {
            id: 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ',
            type: 'balances',
          },
          asset: {
            id: 'BTC',
            type: 'assets',
          },
          type: 'operations-payment',
        },
      ]
      const state = {
        movements: [],
      }

      mutations[types.SET_MOVEMENTS](state, movements)

      expect(state).to.deep.equal({
        movements,
      })
    })

    it('CONCAT_MOVEMENTS should properly modify state', () => {
      const movements = [
        {
          id: '176093659138',
          balance: {
            id: 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ',
            type: 'balances',
          },
          asset: {
            id: 'BTC',
            type: 'assets',
          },
          type: 'operations-payment',
        },
      ]
      const state = {
        movements,
      }

      mutations[types.CONCAT_MOVEMENTS](state, movements)

      expect(state).to.deep.equal({
        movements: movements.concat(movements),
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
    beforeEach(() => {
      api.useBaseURL('https://test.api.com')
      useWallet(wallet)
      sinon.stub(api, 'getWithSignature').resolves()
    })

    afterEach(() => {
      api.getWithSignature.restore()
    })

    describe('LOAD_MOVEMENTS', () => {
      it('calls api.getWithSignature method with provided params', async () => {
        const accountId = 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ'
        const assetCode = 'BTC'
        const expectedParams = {
          page: {
            order: 'desc',
            limit: 10,
          },
          filter: {
            account: 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
            balance: 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ',
          },
          include: ['effect', 'operation.details'],
        }

        await actions[types.LOAD_MOVEMENTS](
          {
            rootGetters: {
              accountId,
              accountBalanceByCode: () => ({
                id: 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ',
                assetCode: 'BTC',
              }),
            },
          },
          assetCode
        )

        expect(api.getWithSignature)
          .to.have.been.calledOnceWithExactly(
            '/v3/history',
            expectedParams
          )
      })
    })

    describe('LOAD_SHARE_MOVEMENTS', () => {
      it('calls api.getWithSignature method with provided params', async () => {
        const assetCode = 'TTK'
        const expectedParams = {
          page: {
            order: 'desc',
            limit: 10,
          },
          filter: {
            asset: 'TTK',
          },
          include: ['effect', 'operation.details'],
        }

        await actions[types.LOAD_SHARE_MOVEMENTS](
          {
            rootGetters: {
              accountBalanceByCode: () => ({
                id: 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ',
                assetCode: 'TTK',
              }),
            },
          },
          assetCode
        )

        expect(api.getWithSignature)
          .to.have.been.calledOnceWithExactly(
            '/v3/movements',
            expectedParams
          )
      })
    })
  })

  describe('getters', () => {
    it('movements', () => {
      const movements = [
        {
          id: '176093659138',
          balance: {
            id: 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ',
            type: 'balances',
          },
          asset: {
            id: 'BTC',
            type: 'assets',
          },
          type: 'operations-payment',
        },
      ]
      const state = { movements }

      expect(getters[types.movements](state))
        .to.deep.equal(movements.map(m => new Movement(m)))
    })
  })
})
