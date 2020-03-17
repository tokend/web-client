import { MockWrapper } from '../test'
import { vuexTypes } from './types'

import account from './account.module'
import accountJSON from '../test/mocks/account'

import Vuex from 'vuex'
import Vue from 'vue'
import { api } from '@/api'

Vue.use(Vuex)

describe('account.module', () => {
  let store

  const id = 'GDEDN7XAPJK4GL4AAYV7LJ7NWNKJI7NZAZPKGYHZJGJMCKN2CRTVRAPR'
  const roleId = 2

  beforeEach(async () => {
    store = new Vuex.Store({
      actions: {},
      getters: {},
      mutations: {},
      state: {},
      modules: { account },
    })

    sinon.stub(api, 'getWithSignature')
      .resolves(MockWrapper.makeJsonapiResponse(accountJSON))

    await store.dispatch(vuexTypes.LOAD_ACCOUNT, id)
  })

  afterEach(() => {
    api.getWithSignature.restore()
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
