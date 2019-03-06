import BalanceExplorerModule from './index'

import Vuex from 'vuex'

import { balanceExplorerModule } from './store/index'

import { Asset } from '../shared/wrappers/asset'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Wallet } from '@tokend/js-sdk'
import * as Api from './_api'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Balance explorer module', () => {
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
  }

  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: { 'balance-explorer': balanceExplorerModule },
    })
  })

  describe('created hook', () => {
    beforeEach(() => {
      sinon.stub(Api, 'initApi')
      sinon.stub(BalanceExplorerModule.methods, 'setAccountId')
      sinon.stub(BalanceExplorerModule.methods, 'loadBalances')
    })

    afterEach(() => {
      Api.initApi.restore()
      BalanceExplorerModule.methods.setAccountId.restore()
      BalanceExplorerModule.methods.loadBalances.restore()
    })

    it('calls initApi function with correct params', async () => {
      await shallowMount(BalanceExplorerModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Api.initApi).to.has.been.calledOnceWithExactly(
        props.wallet, props.config
      )
    })

    it('calls setAccountId method with correct params', async () => {
      await shallowMount(BalanceExplorerModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(BalanceExplorerModule.methods.setAccountId)
        .to.have.been.calledOnceWithExactly(props.wallet.accountId)
    })

    it('calls loadBalances method', async () => {
      await shallowMount(BalanceExplorerModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(BalanceExplorerModule.methods.loadBalances)
        .to.have.been.calledOnce
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sinon.stub(BalanceExplorerModule, 'created').resolves()

      wrapper = shallowMount(BalanceExplorerModule, {
        store,
        localVue,
        propsData: props,
      })
    })

    afterEach(() => {
      BalanceExplorerModule.created.restore()
    })

    describe('method', () => {
      describe('loadBalances', () => {
        it('calls loadAccountBalances method', async () => {
          sinon.stub(wrapper.vm, 'loadAccountBalances').resolves()

          await wrapper.vm.loadBalances()

          expect(wrapper.vm.loadAccountBalances).to.have.been.calledOnce

          wrapper.vm.loadAccountBalances.restore()
        })

        it('sets isLoaded property to true if loading was succeded', async () => {
          sinon.stub(wrapper.vm, 'loadAccountBalances').resolves()

          await wrapper.vm.loadBalances()

          expect(wrapper.vm.isLoaded).to.be.true

          wrapper.vm.loadAccountBalances.restore()
        })

        it('handles the error if loading was failed', async () => {
          sinon.stub(wrapper.vm, 'loadAccountBalances').throws()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadBalances()

          expect(wrapper.vm.isLoadFailed).to.be.true
          expect(ErrorHandler.processWithoutFeedback).to.have.been.calledOnce

          wrapper.vm.loadAccountBalances.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })
      })

      describe('selectAsset', () => {
        it('sets selectedAsset property to passed param', () => {
          const asset = new Asset({ id: 'USD' }, '1.000000')

          wrapper.vm.selectAsset(asset)

          expect(wrapper.vm.selectedAsset).to.deep.equal(asset)
        })

        it('sets isUpdateMode property to false', () => {
          const asset = new Asset({ id: 'USD' }, '1.000000')

          wrapper.setData({
            isUpdateMode: true,
          })

          wrapper.vm.selectAsset(asset)

          expect(wrapper.vm.isUpdateMode).to.be.false
        })

        it('sets isDrawerShown property to true', () => {
          const asset = new Asset({ id: 'USD' }, '1.000000')

          wrapper.setData({
            isDrawerShown: false,
          })

          wrapper.vm.selectAsset(asset)

          expect(wrapper.vm.isDrawerShown).to.be.true
        })
      })
    })
  })
})
