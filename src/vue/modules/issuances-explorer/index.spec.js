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

  beforeEach(() => {
    store = new Vuex.Store({
      modules: { 'issuances-explorer': issuancesExplorerModule },
    })
  })

  describe('created hook', () => {
    it('calls initApi function', () => {
      sinon.stub(Api, 'initApi')

      shallowMount(IssuancesExplorerModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Api.initApi.withArgs(props.wallet, props.config))
        .to.have.been.calledOnce

      Api.initApi.restore()
    })

    it('calls setAccountId method', () => {
      sinon.stub(IssuancesExplorerModule.methods, 'setAccountId')

      shallowMount(IssuancesExplorerModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(IssuancesExplorerModule.methods.setAccountId
        .withArgs(props.wallet.accountId)
      ).to.have.been.calledOnce

      IssuancesExplorerModule.methods.setAccountId.restore()
    })

    it('calls initFirstPageLoader method', () => {
      sinon.stub(IssuancesExplorerModule.methods, 'initFirstPageLoader')

      shallowMount(IssuancesExplorerModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(IssuancesExplorerModule.methods.initFirstPageLoader)
        .to.have.been.calledOnce

      IssuancesExplorerModule.methods.initFirstPageLoader.restore()
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(IssuancesExplorerModule, {
        store,
        localVue,
        propsData: props,
      })
    })

    describe('watcher', () => {
      describe('shouldUpdate', () => {
        it('should call initFirstPageLoader method if the passed value is true', async () => {
          sinon.stub(wrapper.vm, 'initFirstPageLoader').resolves()

          wrapper.setProps({ shouldUpdate: true })

          await wrapper.vm.$nextTick()

          expect(wrapper.vm.initFirstPageLoader).to.have.been.calledOnce

          wrapper.vm.initFirstPageLoader.restore()
        })

        it('should not call initFirstPageLoader method if the passed value is false', async () => {
          sinon.stub(wrapper.vm, 'initFirstPageLoader').resolves()

          wrapper.setProps({ shouldUpdate: false })

          await wrapper.vm.$nextTick()

          expect(wrapper.vm.initFirstPageLoader).to.have.not.been.called

          wrapper.vm.initFirstPageLoader.restore()
        })
      })
    })

    describe('method', () => {
      describe('loadIssuancesFirstPage', () => {
        it('calls loadIssuances method', async () => {
          sinon.stub(wrapper.vm, 'loadIssuances').resolves()

          await wrapper.vm.loadIssuancesFirstPage()

          expect(wrapper.vm.loadIssuances).to.have.been.calledOnce

          wrapper.vm.loadIssuances.restore()
        })

        it('sets isLoaded property to true if loading was succeded', async () => {
          sinon.stub(wrapper.vm, 'loadIssuances').resolves()

          await wrapper.vm.loadIssuancesFirstPage()

          expect(wrapper.vm.isLoaded).to.be.true

          wrapper.vm.loadIssuances.restore()
        })

        it('handles the error if loading was failed', async () => {
          sinon.stub(wrapper.vm, 'loadIssuances').throws()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadIssuancesFirstPage()

          expect(wrapper.vm.isLoadFailed).to.be.true
          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce

          wrapper.vm.loadIssuances.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })
      })
    })
  })
})
