import Dashboard from './Dashboard'

import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Vuelidate from 'vuelidate'

import { createLocalVue, shallowMount } from '@vue/test-utils'
import { globalize } from '@/vue/filters/globalize'
import accountModule from '@/vuex/account.module'
import { vuexTypes } from '@/vuex'
import { ASSET_POLICIES } from '@tokend/js-sdk'

Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)
localVue.use(VueRouter)
localVue.filter('globalize', globalize)

describe('Dashboard component', () => {
  let wrapper
  let store

  const mockedAccountBalances = [
    {
      balance: '1',
      asset: {
        code: 'BTC',
        policies: [
          { value: ASSET_POLICIES.transferable },
          { value: ASSET_POLICIES.baseAsset },
        ],
      },
    },
    {
      balance: '3',
      asset: {
        code: 'USD',
        policies: [
          { value: ASSET_POLICIES.transferable },
          { value: ASSET_POLICIES.baseAsset },
          { value: ASSET_POLICIES.statsQuoteAsset },
        ],
      },
    },
    {
      balance: '0',
      asset: {
        code: 'ETH',
        policies: [
          { value: ASSET_POLICIES.baseAsset },
        ],
      },
    },
  ]

  function mountComponentWithSpecifiedAccountBalances (mockedAccountBalances) {
    sinon.stub(accountModule.getters, vuexTypes.accountBalances)
      .returns(mockedAccountBalances)

    store = new Vuex.Store({
      getters: accountModule.getters,
      actions: accountModule.actions,
    })
    const router = new VueRouter({
      mode: 'history',
      routes: [],
    })

    sinon.stub(Dashboard, 'created').resolves()
    wrapper = shallowMount(Dashboard, {
      store,
      localVue,
      router,
    })
  }

  afterEach(() => {
    sinon.restore()
  })

  describe('watchers', () => {
    beforeEach(() => {
      mountComponentWithSpecifiedAccountBalances(mockedAccountBalances)
    })

    describe('createIssuanceFormIsShown()', () => {
      it('apply "true" value', async () => {
        wrapper.vm.createIssuanceFormIsShown = true

        await localVue.nextTick()

        expect(wrapper.vm.showDrawer).to.be.true
      })

      it('apply "false" value', async () => {
        wrapper.vm.createIssuanceFormIsShown = false

        await localVue.nextTick()

        expect(wrapper.vm.showDrawer).to.be.false
      })
    })

    describe('transferFormIsShown()', () => {
      it('apply "true" value', async () => {
        wrapper.vm.transferFormIsShown = true

        await localVue.nextTick()

        expect(wrapper.vm.showDrawer).to.be.true
      })

      it('apply "false" value', async () => {
        wrapper.vm.transferFormIsShown = false

        await localVue.nextTick()

        expect(wrapper.vm.showDrawer).to.be.false
      })
    })

    describe('showDrawer()', () => {
      it('apply "true" value', async () => {
        wrapper.vm.showDrawer = true

        await localVue.nextTick()

        expect(wrapper.vm.createIssuanceFormIsShown)
          .to.equal(wrapper.vm.createIssuanceFormIsShown)
        expect(wrapper.vm.transferFormIsShown)
          .to.equal(wrapper.vm.transferFormIsShown)
      })

      it('apply "false" value', async () => {
        wrapper.vm.showDrawer = false

        await localVue.nextTick()

        expect(wrapper.vm.createIssuanceFormIsShown).to.be.false
        expect(wrapper.vm.transferFormIsShown).to.be.false
      })
    })
  })
})
