import { MockHelper } from '../test'
import { vuexTypes } from './types'

import { account } from './index'

import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

describe('account.module', () => {
  let mockHelper
  let store

  const id = 'GDJNFSVR45IUX4GG2VQA43YL66XRWEWOIKZ5RNPICCIM4AAIER7AMSV6'
  const isBlocked = true
  const blockReasons = [1]
  const type = 'AccountTypeGeneral'
  const typeI = 2
  const thresholds = {
    low: 10,
    med: 50,
    high: 25
  }
  const referrer = 'GDTWRMF2CA6UTGO62ONVTJWACFZVDWVBQ2NVQLAKHQX5AXAZUO4WBYVK'
  const referrals = [
    'GDUXVIFZFRXBLEY6DVTPYE5RAJLJP3RBX7BCWJ3B33P5VORNFH6SZOKF',
    'GBU5657PSZDX7Z7JQKMRQUUQPA5QYGWQ25TAZ7YLLFFJUERD3OLCOQ5S',
    'GANOA26NIJF3J3C6PZNRYWL3LG5OFBF3AXS5WG2EPWQXG2QNYBT7KJ72'
  ]
  const policiesTypeI = 3
  const policiesTypes = [1, 2]
  const kycBlobId = 'CLHFZSU4WITIMBVVL7QFDNWIH4LKF6NQOXUCDW5NJUH7MWWDRQIQ'
  const externalSystemAccounts = [{
    type: {
      name: 'Bitcoin',
      value: 2
    },
    data: 'mutsYGuQyAKjyT4a7d1t2T2kDhjbxwFZju',
    asset_code: 'BTC'
  },
  {
    type: {
      name: 'Litecoin',
      value: 10
    },
    data: 'mgTbDyNGwJeewjdXmU9cRQe8WDauVqn4WK',
    asset_code: 'LTC'
  },
  {
    type: {
      name: 'Ethereum',
      value: 7
    },
    data: '0xD338E268D1F052B5c58D5F4ceA6AEdD4f5F1E55e',
    asset_code: 'ETH'
  }]

  beforeEach(async () => {
    mockHelper = new MockHelper()
    store = new Vuex.Store({
      actions: {},
      getters: {},
      mutations: {},
      state: {},
      modules: { account }
    })

    mockHelper.mockWallet()
    mockHelper.mockEndpoint(`/accounts/${id}`, {
      'id': id,
      'account_id': id,
      'is_blocked': isBlocked,
      'block_reasons_i': 1,
      'block_reasons': blockReasons,
      'account_type_i': typeI,
      'account_type': type,
      'referrer': referrer,
      'thresholds': {
        'low_threshold': thresholds.low,
        'med_threshold': thresholds.med,
        'high_threshold': thresholds.high
      },
      'balances': [],
      'signers': [],
      'policies': {
        'account_policies_type_i': policiesTypeI,
        'account_policies_types': policiesTypes
      },
      'account_kyc': {
        'KYCData': {
          'blob_id': kycBlobId
        } },
      'external_system_accounts': externalSystemAccounts,
      'referrals': referrals
    })

    await store.dispatch(vuexTypes.LOAD_ACCOUNT, id)
  })

  it('accountId', () => {
    expect(store.getters.accountId).to.deep.equal(id)
  })

  it('accountIsBlocked', () => {
    expect(store.getters.accountIsBlocked).to.deep.equal(isBlocked)
  })

  it('accountBlockReasons', () => {
    expect(store.getters.accountBlockReasons).to.deep.equal(blockReasons)
  })

  it('accountType', () => {
    expect(store.getters.accountType).to.deep.equal(type)
  })

  it('accountTypeI', () => {
    expect(store.getters.accountTypeI).to.deep.equal(typeI)
  })

  it('accountThresholds', () => {
    expect(store.getters.accountThresholds)
      .to
      .deep
      .equal({
        lowThreshold: thresholds.low,
        medThreshold: thresholds.med,
        highThreshold: thresholds.high
      })
  })

  it('accountReferrer', () => {
    expect(store.getters.accountReferrer).to.deep.equal(referrer)
  })

  it('accountReferrals', () => {
    expect(store.getters.accountReferrals).to.deep.equal(referrals)
  })

  it('accountPoliciesTypeI', () => {
    expect(store.getters.accountPoliciesTypeI).to.deep.equal(policiesTypeI)
  })

  it('accountPoliciesTypes', () => {
    expect(store.getters.accountPoliciesTypes).to.deep.equal(policiesTypes)
  })

  it('accountDepositAddresses', () => {
    const expectedDepositAddresses = {
      2: 'mutsYGuQyAKjyT4a7d1t2T2kDhjbxwFZju',
      10: 'mgTbDyNGwJeewjdXmU9cRQe8WDauVqn4WK',
      7: '0xD338E268D1F052B5c58D5F4ceA6AEdD4f5F1E55e'
    }

    expect(store.getters.accountDepositAddresses)
      .to
      .deep
      .equal(expectedDepositAddresses)
  })

  it('accountKycBlobId', () => {
    expect(store.getters.accountKycBlobId)
      .to
      .deep
      .equal(kycBlobId)
  })
})
