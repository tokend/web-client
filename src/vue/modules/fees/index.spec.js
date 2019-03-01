import FeesModule from './index'

import Vuex from 'vuex'

import { feesModule } from './store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import * as Api from './_api'
import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Fees module', () => {
  const props = {
    config: {
      horizonUrl: 'https://test.api.com',
    },
    assetCode: 'USD',
    accountId: 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
    accountRoleId: '5',
  }

  let store
  let wrapper

  beforeEach(() => {
    store = new Vuex.Store({
      actions: {},
      getters: {},
      mutations: {},
      state: {},
      modules: { 'fees': feesModule },
    })

    wrapper = shallowMount(FeesModule, {
      store,
      localVue,
      propsData: props,
    })
  })

  describe('created hook', () => {
    it('initializes the API', () => {
      const spy = sinon.spy(Api, 'initApi')

      shallowMount(FeesModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(spy.withArgs(props.config).calledOnce).to.be.true

      spy.restore()
    })

    it('sets the account ID', () => {
      const spy = sinon.spy(FeesModule.methods, 'setAccountId')

      shallowMount(FeesModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(spy.withArgs(props.accountId).calledOnce).to.be.true

      spy.restore()
    })

    it('sets the account role ID', () => {
      const spy = sinon.spy(FeesModule.methods, 'setAccountRoleId')

      shallowMount(FeesModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(spy.withArgs(props.accountRoleId).calledOnce).to.be.true

      spy.restore()
    })
  })

  describe('computed property', () => {
    describe('firstPageLoader', () => {
      it('returns an instance of loadFeesFirstPage method', async () => {
        const spy = sinon.stub(wrapper.vm, 'loadFeesFirstPage').resolves()

        await wrapper.vm.firstPageLoader()

        expect(spy.withArgs(props.assetCode).calledOnce).to.be.true
      })
    })
  })

  describe('method', () => {
    describe('loadFeesFirstPage', () => {
      it('loads the fees by provided asset code', async () => {
        const spy = sinon.stub(wrapper.vm, 'loadFees').resolves({
          data: [],
        })

        await wrapper.vm.loadFeesFirstPage(props.assetCode)

        expect(spy.withArgs(props.assetCode).calledOnce).to.be.true
      })

      it('sets isLoaded property to true if loading was succeded', async () => {
        sinon.stub(wrapper.vm, 'loadFees').resolves({
          data: [],
        })

        await wrapper.vm.loadFeesFirstPage(props.assetCode)

        expect(wrapper.vm.isLoaded).to.be.true
      })

      it('handles the error if loading was failed', async () => {
        sinon.stub(wrapper.vm, 'loadFees').throws()
        const spy = sinon.stub(ErrorHandler, 'processWithoutFeedback')

        await wrapper.vm.loadFeesFirstPage(props.assetCode)

        expect(wrapper.vm.isLoadFailed).to.be.true
        expect(spy.calledOnce).to.be.true
      })
    })
  })
})
