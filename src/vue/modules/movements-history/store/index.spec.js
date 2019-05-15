import { mutations, getters, actions } from './index'
import { types } from './types'

import { Wallet } from '@tokend/js-sdk'

import { Movement } from '../wrappers/movement'
import { Balance } from '../wrappers/balance'

import { api, useWallet } from '@/api'
import accountBalancesJSON from '@/test/mocks/account-balances'

describe('movements-history.module', () => {
  describe('mutations', () => {
    it('SET_BALANCES should properly modify state', () => {
      const balances = [
        {
          id: 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ',
          asset: {
            id: 'BTC',
            type: 'assets',
          },
        },
      ]
      const state = {
        balances: [],
      }

      mutations[types.SET_BALANCES](state, balances)

      expect(state).to.deep.equal({
        balances,
      })
    })

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
    const accountId = 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ'
    const wallet = new Wallet(
      'test@mail.com',
      'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
      'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
      '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
    )

    let store

    beforeEach(() => {
      store = {
        state: {},
        rootGetters: {
          accountId: accountId,
        },
        commit: sinon.stub(),
        dispatch: sinon.stub(),
      }

      api.useBaseURL('https://test.api.com')
      useWallet(wallet)
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

        sinon.stub(api, 'getWithSignature').resolves()

        await actions[types.LOAD_MOVEMENTS](
          {
            getters: {
              getBalanceByAssetCode: () => ({
                id: 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ',
                assetCode: 'BTC',
              }),
            },
            rootGetters: {
              accountId: accountId,
            },
          },
          assetCode
        )

        expect(api.getWithSignature)
          .to.have.been.calledOnceWithExactly(
            '/v3/history',
            expectedParams
          )

        api.getWithSignature.restore()
      })
    })
    describe('LOAD_BALANCES', () => {
      it('calls api.getWithSignature method with provided params', async () => {
        sinon.stub(api, 'getWithSignature')
          .resolves({
            data: {
              balances: accountBalancesJSON,
            },
          })

        const expectedMutations = {
          [types.SET_BALANCES]: accountBalancesJSON,
        }

        await actions[types.LOAD_BALANCES](store)

        expect(store.commit.args)
          .to
          .deep
          .equal(Object.entries(expectedMutations))

        api.getWithSignature.restore()
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
    it('balances', () => {
      const balances = [
        {
          id: 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ',
          asset: {
            id: 'BTC',
            type: 'assets',
          },
        },
      ]
      const state = { balances }

      expect(getters[types.balances](state))
        .to.deep.equal(balances.map(b => new Balance(b)))
    })
    it('getBalanceByAssetCode', () => {
      const balances = [
        { id: 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ',
          assetCode: 'BTC',
        },
        { id: 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FFD',
          assetCode: 'ETH',
        },
      ]
      const expectedResult = {
        id: 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ',
        assetCode: 'BTC',
      }
      const assetCode = 'BTC'
      const _getters = { balances }

      expect(getters[types.getBalanceByAssetCode]({}, _getters)(assetCode))
        .to
        .deep
        .equal(expectedResult)
    })
  })
})
