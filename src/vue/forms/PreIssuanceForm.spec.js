import PreIssuanceForm from './PreIssuanceForm'
import OwnedAssetsLoaderMixin from '@/vue/mixins/owned-assets-loader.mixin'

import Vue from 'vue'
import Vuex from 'vuex'

import { base } from '@tokend/js-sdk'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { MockHelper } from '@/test'

import { Bus } from '@/js/helpers/event-bus'
import { FileUtil } from '@/js/utils/file.util'

import { vuexTypes } from '@/vuex'
import accountModule from '@/vuex/account.module'

// HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// Vue 2.6 so everything get fixed
Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuex)

describe('PreIssuanceForm component unit test', () => {
  const sampleIssuanceData = {
    ownedAssets: [{
      code: 'PLT'
    }],
    issuance: {
      asset: 'PLT',
      amount: 10
    },
    preIssuanceDocument: {},
    isLoaded: true
  }

  let wrapper
  let mockHelper
  let transactionsResource
  let store

  afterEach(() => {
    sinon.restore()
  })

  beforeEach(() => {
    mockHelper = new MockHelper()
    transactionsResource =
      mockHelper.getHorizonResourcePrototype('transactions')

    const getters = accountModule.getters
    sinon.stub(getters, vuexTypes.account)
      .returns({ accountId: mockHelper.getMockWallet().accountId })
    store = new Vuex.Store({
      getters
    })

    sinon.stub(PreIssuanceForm, 'created').resolves()
    wrapper = shallowMount(PreIssuanceForm, {
      store,
      localVue,
      data: _ => Object.assign({}, sampleIssuanceData)
    })
  })

  describe('watcher', () => {
    it('extracts pre-issuance request after changing preIssuanceDocument', () => {
      const spy = sinon.stub(wrapper.vm, 'extractPreIssuanceRequest')
        .resolves()

      wrapper.setData({ preIssuanceDocument: { file: {} } })

      expect(spy.calledOnce).to.be.true
    })
  })

  describe('created hook', () => {
    let loadAssetsSpy

    beforeEach(() => {
      PreIssuanceForm.created.restore()
      loadAssetsSpy = sinon.stub(OwnedAssetsLoaderMixin.methods,
        'loadOwnedAssets'
      ).resolves()
    })

    it('loads user owned assets', async () => {
      await shallowMount(PreIssuanceForm, {
        mixins: [OwnedAssetsLoaderMixin],
        localVue
      })

      expect(loadAssetsSpy.calledOnce).to.be.true
    })

    it('sets isLoaded property to true', async () => {
      wrapper = await shallowMount(PreIssuanceForm, {
        mixins: [OwnedAssetsLoaderMixin],
        localVue
      })

      expect(wrapper.vm.isLoaded).to.be.true
    })
  })

  describe('method', () => {
    describe('submit', () => {
      let operationBuilderSpy
      let submitTransactionsSpy

      beforeEach(() => {
        operationBuilderSpy = sinon.stub(base.PreIssuanceRequestOpBuilder,
          'createPreIssuanceRequestOp'
        ).returns({})
        submitTransactionsSpy = sinon.stub(transactionsResource,
          'submitOperations'
        ).resolves()
      })

      it('creates pre-issuance operation', async () => {
        await wrapper.vm.submit()

        expect(operationBuilderSpy.calledOnce).to.be.true
      })

      it('submits pre-issuance operation', async () => {
        await wrapper.vm.submit()

        expect(submitTransactionsSpy.calledOnce).to.be.true
      })

      it('resets all properties after successful submitting', async () => {
        const spy = sinon.stub(wrapper.vm, 'reset')

        await wrapper.vm.submit()

        expect(spy.calledOnce).to.be.true
      })

      it('shows the error if pre-issuance document was not loaded', async () => {
        wrapper.setData({ preIssuanceDocument: null })
        const spy = sinon.stub(Bus, 'error')

        await wrapper.vm.submit()

        expect(spy.calledOnce).to.be.true
      })
    })

    describe('extractPreIssuanceRequest', () => {
      const issuanceJson = '{ "issuances": [{}] }'
      let fileSpy
      let parsePreIssuanceSpy

      beforeEach(() => {
        fileSpy = sinon.stub(FileUtil, 'getText').resolves(issuanceJson)
        parsePreIssuanceSpy = sinon.stub(wrapper.vm, 'parsePreIssuance')
      })

      it('gets text from the pre-issuance file', async () => {
        await wrapper.vm.extractPreIssuanceRequest()

        expect(fileSpy.calledOnce).to.be.true
      })

      it('parses extracted pre-issuance', async () => {
        await wrapper.vm.extractPreIssuanceRequest()

        expect(parsePreIssuanceSpy.calledOnce).to.be.true
      })
    })

    describe('parsePreIssuance', () => {
      const preIssuance = {
        preEmission: '00000003504c54000000000005f5e10042c5f77f000000408e138ec30b5f7aaecfcb42436868c04430868ed4847184a583bff7473f1deac5c519980bd7210afe77df44eadce3c2deada7da57b38aded1379ad2051be88d030000001437743250577a7939527a324a4d3253466d416f7800000000',
        used: false
      }

      it('converts pre-issuance from xdr', () => {
        const spy = sinon.stub(base.PreIssuanceRequest, 'dataFromXdr')
          .returns({})

        wrapper.vm.parsePreIssuance(preIssuance)

        expect(spy.calledOnce).to.be.true
      })

      it('sets converted pre-issuance to issuance property', () => {
        wrapper.setData({
          issuance: null
        })

        wrapper.vm.parsePreIssuance(preIssuance)

        expect(wrapper.vm.issuance).to.be.not.null
      })

      it('sets issuance to null if pre-issuance asset is not owned by the user', () => {
        sinon.stub(wrapper.vm, 'isAssetDefined').returns(false)

        wrapper.vm.parsePreIssuance(preIssuance)

        expect(wrapper.vm.issuance).to.be.null
      })
    })

    describe('isAssetDefined', () => {
      it('returns true if the user owns certain asset', () => {
        const response = wrapper.vm.isAssetDefined(
          sampleIssuanceData.ownedAssets[0].code
        )

        expect(response).to.be.true
      })

      it('returns false if the user does not own certain asset', () => {
        const response = wrapper.vm.isAssetDefined('Not Owned Token')

        expect(response).to.be.false
      })
    })

    describe('reset', () => {
      it('sets issuance property to null', () => {
        wrapper.vm.reset()

        expect(wrapper.vm.issuance).to.be.null
      })

      it('sets preIssuanceDocument property to null', () => {
        wrapper.vm.reset()

        expect(wrapper.vm.preIssuanceDocument).to.be.null
      })
    })
  })
})
