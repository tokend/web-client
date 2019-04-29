import FeesModule from './index'

import Vuex from 'vuex'

import { feesModule } from './store/index'
import { types } from './store/types'

import { Fee } from './wrappers/fee'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { Wallet } from '@tokend/js-sdk'
import * as Api from '@/api'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Fees module', () => {
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
    assetCode: 'USD',
  }

  const fees = [
    new Fee({
      appliedTo: {
        asset: 'USD',
      },
      fixed: '1.000000',
    }),
    new Fee({
      appliedTo: {
        asset: 'BTC',
      },
      fixed: '2.000000',
      percent: '3.000000',
    }),
    new Fee({
      appliedTo: {
        asset: 'USD',
      },
      percent: '2.000000',
    }),
    new Fee({
      appliedTo: {
        asset: 'USD',
      },
    }),
  ]

  let store

  beforeEach(() => {
    sinon.stub(feesModule.getters, types.fees).returns(fees)

    store = new Vuex.Store({
      modules: { 'fees': feesModule },
    })
  })

  afterEach(() => {
    feesModule.getters[types.fees].restore()
  })

  describe('created hook', () => {
    beforeEach(() => {
      sinon.stub(Api, 'initApi')
      sinon.stub(FeesModule.methods, 'setAccountId')
      sinon.stub(FeesModule.methods, 'loadFees')
    })

    afterEach(() => {
      Api.initApi.restore()
      FeesModule.methods.setAccountId.restore()
      FeesModule.methods.loadFees.restore()
    })

    it('calls initApi function with correct params', async () => {
      await shallowMount(FeesModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(Api.initApi).to.has.been.calledOnceWithExactly(
        props.wallet, props.config
      )
    })

    it('calls setAccountId method with correct params', async () => {
      await shallowMount(FeesModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(FeesModule.methods.setAccountId)
        .to.have.been.calledOnceWithExactly(props.wallet.accountId)
    })

    it('calls loadFees method', async () => {
      await shallowMount(FeesModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(FeesModule.methods.loadFees)
        .to.have.been.calledOnce
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sinon.stub(FeesModule, 'created').resolves()

      wrapper = shallowMount(FeesModule, {
        store,
        localVue,
        propsData: props,
      })
    })

    afterEach(() => {
      FeesModule.created.restore()
    })

    describe('computed property', () => {
      describe('valuableFeesByAssetCode', () => {
        it('returns fees filtered by asset code and having fixed or percent value', () => {
          const expectedFees = [
            new Fee({
              appliedTo: {
                asset: 'USD',
              },
              fixed: '1.000000',
            }),
            new Fee({
              appliedTo: {
                asset: 'USD',
              },
              percent: '2.000000',
            }),
          ]

          expect(wrapper.vm.valuableFeesByAssetCode)
            .to.deep.equal(expectedFees)
        })
      })
    })

    describe('method', () => {
      describe('loadFees', () => {
        it('calls loadAccountFees method', async () => {
          sinon.stub(wrapper.vm, 'loadAccountFees').resolves()

          await wrapper.vm.loadFees()

          expect(wrapper.vm.loadAccountFees).to.have.been.calledOnce

          wrapper.vm.loadAccountFees.restore()
        })

        it('sets isLoaded property to true if loading was succeded', async () => {
          sinon.stub(wrapper.vm, 'loadAccountFees').resolves()

          await wrapper.vm.loadFees()

          expect(wrapper.vm.isLoaded).to.be.true

          wrapper.vm.loadAccountFees.restore()
        })

        it('handles the error if loading was failed', async () => {
          sinon.stub(wrapper.vm, 'loadAccountFees').throws()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadFees()

          expect(wrapper.vm.isLoadFailed).to.be.true
          expect(ErrorHandler.processWithoutFeedback).to.have.been.calledOnce

          wrapper.vm.loadAccountFees.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })
      })
    })
  })
})
