import IssuancesExplorerModule from './index'

import Vuex from 'vuex'

import { issuancesExplorerModule } from './store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Wallet } from '@tokend/js-sdk'

import * as Api from './_api'
import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Issuances explorer module', () => {
  const props = {
    config: {
      horizonUrl: 'https://test.api.com',
    },
    wallet: new Wallet(
      'test@mail.com',
      'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
      'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
      '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
    ),
    shouldUpdate: false,
  }

  let store
  let wrapper

  beforeEach(() => {
    store = new Vuex.Store({
      modules: { 'issuances-explorer': issuancesExplorerModule },
    })

    wrapper = shallowMount(IssuancesExplorerModule, {
      store,
      localVue,
      propsData: props,
    })
  })

  describe('created hook', () => {
    it('initializes the API', () => {
      const spy = sinon.spy(Api, 'initApi')

      shallowMount(IssuancesExplorerModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(spy.withArgs(props.wallet, props.config).calledOnce).to.be.true

      spy.restore()
    })

    it('sets the account ID', () => {
      const spy = sinon.spy(IssuancesExplorerModule.methods, 'setAccountId')

      shallowMount(IssuancesExplorerModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(spy.withArgs(props.wallet.accountId).calledOnce).to.be.true

      spy.restore()
    })

    it('initializes first issuances page loader', () => {
      const spy = sinon.spy(IssuancesExplorerModule.methods, 'initFirstPageLoader')

      shallowMount(IssuancesExplorerModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(spy.calledOnce).to.be.true

      spy.restore()
    })
  })

  describe('watcher', () => {
    describe('shouldUpdate', () => {
      it('should initialize page loader if the passed value is true', () => {
        const spy = sinon.stub(wrapper.vm, 'initFirstPageLoader').resolves()

        wrapper.setProps({ shouldUpdate: true })

        wrapper.vm.$nextTick(_ => {
          expect(spy.calledOnce).to.be.true
          spy.restore()
        })
      })

      it('should emit update event if the passed value is true', () => {
        sinon.stub(wrapper.vm, 'initFirstPageLoader').resolves()
        const updateEvent = 'update:shouldUpdate'

        wrapper.setProps({ shouldUpdate: true })

        wrapper.vm.$nextTick(_ => {
          expect(wrapper.emitted()[updateEvent]).to.exist
          wrapper.vm.initFirstPageLoader.restore()
        })
      })

      it('should not initialize page loader if the passed value is false', () => {
        const spy = sinon.stub(wrapper.vm, 'initFirstPageLoader').resolves()

        wrapper.setProps({ shouldUpdate: false })

        wrapper.vm.$nextTick(_ => {
          expect(spy.notCalled).to.be.true
          spy.restore()
        })
      })
    })
  })

  describe('method', () => {
    describe('loadIssuancesFirstPage', () => {
      it('loads the account issuances', async () => {
        const spy = sinon.stub(wrapper.vm, 'loadIssuances').resolves({
          data: [],
        })

        await wrapper.vm.loadIssuancesFirstPage()

        expect(spy.calledOnce).to.be.true

        spy.restore()
      })

      it('sets isLoaded property to true if loading was succeded', async () => {
        sinon.stub(wrapper.vm, 'loadIssuances').resolves({
          data: [],
        })

        await wrapper.vm.loadIssuancesFirstPage()

        expect(wrapper.vm.isLoaded).to.be.true

        wrapper.vm.loadIssuances.restore()
      })

      it('handles the error if loading was failed', async () => {
        sinon.stub(wrapper.vm, 'loadIssuances').throws()
        const spy = sinon.stub(ErrorHandler, 'processWithoutFeedback')

        await wrapper.vm.loadIssuancesFirstPage()

        expect(wrapper.vm.isLoadFailed).to.be.true
        expect(spy.calledOnce).to.be.true

        wrapper.vm.loadIssuances.restore()
        spy.restore()
      })
    })
  })
})
