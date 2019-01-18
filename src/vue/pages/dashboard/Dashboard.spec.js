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
        policies: [
          { value: ASSET_POLICIES.transferable },
          { value: ASSET_POLICIES.baseAsset }
        ]
      }
    },
    {
      asset: 'USD',
      balance: '3',
      assetDetails: {
        policies: [
          { value: ASSET_POLICIES.transferable },
          { value: ASSET_POLICIES.baseAsset },
          { value: ASSET_POLICIES.statsQuoteAsset }
        ]
      }
    },
    {
      asset: 'ETH',
      balance: '0',
      assetDetails: {
        policies: [
          { value: ASSET_POLICIES.baseAsset }
        ]
      }
    }
  ]

  function mountComponentWithSpecifiedAccountBalances (mockedAccountBalances) {
    sinon.stub(accountModule.getters, vuexTypes.accountBalances)
      .returns(mockedAccountBalances)

    store = new Vuex.Store({
      getters: accountModule.getters,
      actions: accountModule.actions
    })

    wrapper = shallowMount(Dashboard, {
      store,
      localVue
    })
  }

  afterEach(() => {
    sinon.restore()
  })

  describe('showCreateIssuanceForm()', () => {
    beforeEach(() => {
      mountComponentWithSpecifiedAccountBalances(mockedAccountBalances)
    })

    it('set createIssuanceFormIsShown status "true"', () => {
      wrapper.vm.showCreateIssuanceForm(true)

      expect(wrapper.vm.createIssuanceFormIsShown).to.be.true
    })

    it('set createIssuanceFormIsShown status "false"', () => {
      wrapper.vm.showCreateIssuanceForm(false)

      expect(wrapper.vm.createIssuanceFormIsShown).to.be.false
    })
  })

  describe('showTransferForm()', () => {
    beforeEach(() => {
      mountComponentWithSpecifiedAccountBalances(mockedAccountBalances)
    })

    it('set transferFormIsShown status "true"', () => {
      wrapper.vm.showTransferForm(true)

      expect(wrapper.vm.transferFormIsShown).to.be.true
    })

    it('set transferFormIsShown status "false"', () => {
      wrapper.vm.showTransferForm(false)

      expect(wrapper.vm.transferFormIsShown).to.be.false
    })
  })

  describe('setCurrentAsset()', () => {
    it('set currentAsset as passed value', () => {
      mountComponentWithSpecifiedAccountBalances(mockedAccountBalances)
      wrapper.vm.setCurrentAsset('some name (BTC)')

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
                { value: ASSET_POLICIES.baseAsset }
              ]
            }
          }
        ]
        mountComponentWithSpecifiedAccountBalances(mockedAccountBalances)

        wrapper.vm.setCurrentAsset()

        expect(wrapper.vm.currentAsset).to.equal('BTC')
      })

      it('set null if accountBalances is empty', () => {
        const mockedAccountBalances = []
        mountComponentWithSpecifiedAccountBalances(mockedAccountBalances)

        wrapper.vm.setCurrentAsset()

        expect(wrapper.vm.currentAsset).to.equal(null)
      })
    })
  })

  describe('watchers', () => {
    beforeEach(() => {
      mountComponentWithSpecifiedAccountBalances(mockedAccountBalances)
    })

    describe('createIssuanceFormIsShown()', () => {
      it('apply "true" value', () => {
        wrapper.vm.createIssuanceFormIsShown = true

        expect(wrapper.vm.showDrawer).to.be.true
      })

      it('apply "false" value', () => {
        wrapper.vm.createIssuanceFormIsShown = false

        expect(wrapper.vm.showDrawer).to.be.false
      })
    })

    describe('transferFormIsShown()', () => {
      it('apply "true" value', () => {
        wrapper.vm.transferFormIsShown = true

        expect(wrapper.vm.showDrawer).to.be.true
      })

      it('apply "false" value', () => {
        wrapper.vm.transferFormIsShown = false

        expect(wrapper.vm.showDrawer).to.be.false
      })
    })

    describe('showDrawer()', () => {
      it('apply "true" value', () => {
        wrapper.vm.showDrawer = true

        expect(wrapper.vm.createIssuanceFormIsShown)
          .to.equal(wrapper.vm.createIssuanceFormIsShown)
        expect(wrapper.vm.transferFormIsShown)
          .to.equal(wrapper.vm.transferFormIsShown)
      })

      it('apply "false" value', () => {
        wrapper.vm.showDrawer = false

        expect(wrapper.vm.createIssuanceFormIsShown).to.be.false
        expect(wrapper.vm.transferFormIsShown).to.be.false
      })
    })
  })
})
