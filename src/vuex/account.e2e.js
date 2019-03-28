import { MockHelper } from '../test'
import { vuexTypes } from './types'

import account from './account.module'
import accountJSON from '../test/mocks/account'

import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

describe('account.module', () => {
  let mockHelper
  let store

  const id = 'GDEDN7XAPJK4GL4AAYV7LJ7NWNKJI7NZAZPKGYHZJGJMCKN2CRTVRAPR'
  const roleId = '2'

  beforeEach(async () => {
    mockHelper = new MockHelper()
    store = new Vuex.Store({
      actions: {},
      getters: {},
      mutations: {},
      state: {},
      modules: { account },
    })

    mockHelper.useMockWallet()
    mockHelper.mockEndpoint(`/v3/accounts/${id}?include=external_system_ids%2Cbalances`, accountJSON)

    await store.dispatch(vuexTypes.LOAD_ACCOUNT, id)
  })

  it('accountId', () => {
    expect(store.getters[vuexTypes.accountId])
      .to
      .deep
      .equal(id)
  })

  it('accountRoleId', () => {
    expect(store.getters[vuexTypes.accountRoleId])
      .to
      .deep
      .equal(roleId)
  })
})
