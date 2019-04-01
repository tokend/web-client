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
  let sandbox
  let store

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    store = new Vuex.Store({
      modules: { 'balance-explorer': balanceExplorerModule },
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('created hook', () => {
    it('inits API, sets account ID, and loads balances', async () => {
      sandbox.stub(Api, 'initApi')
      sandbox.stub(BalanceExplorerModule.methods, 'setAccountId')
      sandbox.stub(BalanceExplorerModule.methods, 'loadBalances')

      const props = {
        config: {
          horizonURL: 'https://test.api.com',
          storageURL: 'https://storage.com',
        },
        wallet: new Wallet(
          'test@mail.com',
          'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
          'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
          '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
        ),
      }

      await shallowMount(BalanceExplorerModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Api.initApi).to.has.been.calledOnceWithExactly(
        props.wallet, props.config
      )
      expect(BalanceExplorerModule.methods.setAccountId)
        .to.have.been.calledOnceWithExactly(props.wallet.accountId)
      expect(BalanceExplorerModule.methods.loadBalances)
        .to.have.been.calledOnce
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sandbox.stub(BalanceExplorerModule, 'created').resolves()

      wrapper = shallowMount(BalanceExplorerModule, {
        store,
        localVue,
        propsData: {
          config: {
            storageURL: 'https://storage.com',
          },
          wallet: {
            accountId: 'SOME_ACCOUNT_ID',
          },
        },
      })
    })

    describe('method', () => {
      describe('loadBalances', () => {
        it('calls loadAccountBalances method and sets isLoaded property to true if loading was succeded', async () => {
          sandbox.stub(wrapper.vm, 'loadAccountBalances').resolves()

          await wrapper.vm.loadBalances()

          expect(wrapper.vm.loadAccountBalances).to.have.been.calledOnce
          expect(wrapper.vm.isLoaded).to.be.true
        })

        it('handles the error if loading was failed', async () => {
          sandbox.stub(wrapper.vm, 'loadAccountBalances').throws()
          sandbox.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadBalances()

          expect(wrapper.vm.isLoadFailed).to.be.true
          expect(ErrorHandler.processWithoutFeedback).to.have.been.calledOnce
        })
      })

      describe('selectAsset', () => {
        it('sets selectedAsset property to passed param, isUpdateMode property to false, and isDrawerShown property to true', () => {
          const asset = new Asset({ id: 'USD' }, '1.000000')

          wrapper.setData({
            isUpdateMode: true,
            isDrawerShown: false,
          })

          wrapper.vm.selectAsset(asset)

          expect(wrapper.vm.selectedAsset).to.deep.equal(asset)
          expect(wrapper.vm.isUpdateMode).to.be.false
          expect(wrapper.vm.isDrawerShown).to.be.true
        })
      })
    })
  })
})
