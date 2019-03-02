import { mutations, getters, actions } from './index'
import { types } from './types'

import { Issuance } from '../wrappers/issuance'

import { Sdk } from '@/sdk'
import { OP_TYPES } from '@tokend/js-sdk'

describe('issuances-explorer.module', () => {
  const accountId = 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ'
  const issuances = [{
    id: '1',
    amount: '100.000000',
  }, {
    id: '2',
    amount: '50.000000',
  }]

  describe('mutations', () => {
    let state

    beforeEach(() => {
      state = {
        accountId: '',
        issuances: [],
      }
    })

    it('SET_ACCOUNT_ID should properly modify state', () => {
      mutations[types.SET_ACCOUNT_ID](state, accountId)

      expect(state).to.deep.equal({
        accountId: accountId,
        issuances: [],
      })
    })

    it('SET_ISSUANCES should properly modify state', () => {
      mutations[types.SET_ISSUANCES](state, issuances)

      expect(state).to.deep.equal({
        accountId: '',
        issuances,
      })
    })

    it('CONCAT_ISSUANCES should properly modify state', () => {
      mutations[types.SET_ISSUANCES](state, issuances)
      mutations[types.CONCAT_ISSUANCES](state, issuances)

      expect(state).to.deep.equal({
        accountId: '',
        issuances: issuances.concat(issuances),
      })
    })
  })

  describe('actions', () => {
    it('LOAD_ISSUANCES', async () => {
      it('loads create issuance operations by provided account ID', async () => {
        const spy = sinon.stub(Sdk.horizon.operations, 'getPage').resolves({
          data: [],
        })

        await actions[types.LOAD_ISSUANCES]({ getters: { accountId } })

        expect(spy
          .withArgs({
            account_id: accountId,
            operation_type: OP_TYPES.createIssuanceRequest,
          })
          .calledOnce
        ).to.be.true

        spy.restore()
      })
    })
  })

  describe('getters', () => {
    it('accountId', () => {
      const state = { accountId }

      expect(getters[types.accountId](state))
        .to.equal(accountId)
    })

    it('issuances', () => {
      const state = { issuances }

      expect(getters[types.issuances](state))
        .to.deep.equal(issuances.map(i => new Issuance(i)))
    })
  })
})
