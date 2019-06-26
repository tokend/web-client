import MovementsHistoryModule from './index'

import { Wallet } from '@tokend/js-sdk'
import Vuex from 'vuex'

import { mount, createLocalVue } from '@vue/test-utils'

import { api, useWallet } from '@/api'

const localVue = createLocalVue()

describe('Load asset types mixin', () => {
  let wrapper
  let store

  const $route = {
    name: 'app.movements',
  }

  beforeEach(() => {
    store = new Vuex.Store({
      getters: {
        accountId: () => (
          'GDLI4EG4S5Q6G2JOM3OVVMODNE25OBYDKPUR2IKDTDRDP5ZNO57HGZ6D'
        ),
        accountBalanceByCode: () => () => (
          { id: 'GDLI4EG4S5Q6G2JOM3OVVMODNE25OBYDKPUR2IKDTDRDP5ZNO57HGZ6D' }
        ),
      },
    })
    wrapper = mount(MovementsHistoryModule, {
      localVue,
      store,
      mocks: {
        $route,
      },
    })
  })

  describe('method', () => {
    describe('load', () => {
      beforeEach(() => {
        const wallet = new Wallet(
          'test@mail.com',
          'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
          'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
          '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
        )

        api.useBaseURL('https://test.api.com')
        useWallet(wallet)
      })
      afterEach(() => {
        api.getWithSignature.restore()
      })

      it('loads movement history list api.getWithSignature method',
        async () => {
          sinon.stub(wrapper.vm, 'isSharesPage').returns(false)
          sinon.stub(api, 'getWithSignature').resolves()

          await wrapper.vm.load()

          expect(api.getWithSignature).to.have.been.calledOnce
        })
    })
  })
})
