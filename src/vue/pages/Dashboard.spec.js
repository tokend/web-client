import Dashboard from './Dashboard'

import Vue from 'vue'
import Vuex from 'vuex'
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
localVue.filter('globalize', globalize)

describe('Dashboard component', () => {
  let wrapper
  let store

  const mockedAccountBalances = [
    {
      asset: 'BTC',
      balance: '1',
      assetDetails: {
        code: 'BTC',
        policies: [
          { value: ASSET_POLICIES.transferable },
          { value: ASSET_POLICIES.baseAsset },
        ],
      },
    },
    {
      asset: 'USD',
      balance: '3',
      assetDetails: {
        code: 'USD',
        policies: [
          { value: ASSET_POLICIES.transferable },
          { value: ASSET_POLICIES.baseAsset },
          { value: ASSET_POLICIES.statsQuoteAsset },
        ],
      },
    },
    {
      asset: 'ETH',
      balance: '0',
      assetDetails: {
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

    wrapper = shallowMount(Dashboard, {
      store,
      localVue,
    })
  }

  afterEach(() => {
    sinon.restore()
  })

  describe('setCurrentAsset()', () => {
    it('set currentAsset as passed value', () => {
      mountComponentWithSpecifiedAccountBalances(mockedAccountBalances)
      wrapper.vm.setCurrentAsset({ code: 'BTC' })

      expect(wrapper.vm.currentAsset).to.equal('BTC')
    })

    describe('set default currentAsset =>', () => {
      it('set ETH if accountBalances has one', () => {
        mountComponentWithSpecifiedAccountBalances(mockedAccountBalances)
        wrapper.vm.setCurrentAsset()

        expect(wrapper.vm.currentAsset).to.equal('ETH')
      })

      it('set first asset code in accountBalances list if ETH balance does not exists', () => {
        const mockedAccountBalances = [
          {
            asset: 'BTC',
            balance: '1',
            assetDetails: {
              policies: [
                { value: ASSET_POLICIES.transferable },
                { value: ASSET_POLICIES.baseAsset },
              ],
            },
          },
        ]
        mountComponentWithSpecifiedAccountBalances(mockedAccountBalances)

        wrapper.vm.setCurrentAsset()

        expect(wrapper.vm.currentAsset).to.equal('BTC')
      })

      it('set empty string if accountBalances is empty', () => {
        const mockedAccountBalances = []
        mountComponentWithSpecifiedAccountBalances(mockedAccountBalances)

        wrapper.vm.setCurrentAsset()

        expect(wrapper.vm.currentAsset).to.equal('')
      })
    })
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
