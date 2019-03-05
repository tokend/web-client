import Issuance from './Issuance'

import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import { IssuanceRecord } from '@/js/records/operations/issuance.record'

import { vuexTypes } from '@/vuex'
import accountModule from '@/vuex/account.module'

import { createLocalVue, shallowMount } from '@vue/test-utils'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Vuex)

describe('Issuance component unit test', () => {
  const sampleData = [{
    asset: 'BTC',
    participants: [],
  }]

  let getters
  let store
  let wrapper

  beforeEach(() => {
    getters = {
      ...accountModule.getters,
    }
    sinon.stub(getters, vuexTypes.accountId).returns('ACCOUNT_ID')
    sinon.stub(getters, vuexTypes.accountRoleId).returns(-1)
    store = new Vuex.Store({
      getters,
    })

    wrapper = shallowMount(Issuance, {
      store,
      localVue,
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('method', () => {
    describe('setHistory', () => {
      it('changes issuance history data', () => {
        wrapper.vm.setHistory(sampleData)

        expect(wrapper.vm.issuanceHistory.length).to.not.equal(0)
      })

      it('converts every arguments data record to IssuanceRecord', () => {
        wrapper.vm.setHistory(sampleData)

        expect(
          wrapper.vm.issuanceHistory
            .every(record => record instanceof IssuanceRecord)
        ).to.be.true
      })

      it('set isLoaded property to true', async () => {
        wrapper.vm.setHistory([])

        expect(wrapper.vm.isLoaded).to.be.true
      })
    })

    describe('extendHistory', () => {
      it('pushes data records to issuance history', () => {
        wrapper.setData({ issuanceHistory: sampleData })

        wrapper.vm.extendHistory(sampleData)

        expect(wrapper.vm.issuanceHistory.length)
          .to.equal(sampleData.length * 2)
      })

      it('converts every arguments data record to IssuanceRecord', () => {
        wrapper.vm.extendHistory(sampleData)

        expect(
          wrapper.vm.issuanceHistory
            .every(record => record instanceof IssuanceRecord)
        ).to.be.true
      })
    })
  })
})
