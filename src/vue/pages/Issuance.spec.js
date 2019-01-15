// import Issuance from './Issuance'

// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import Vuex from 'vuex'

// import { OPERATION_TYPES } from '@/js/const/xdr.const'
// import { xdrEnumToConstant } from '@/js/utils/xdr-enum-to-constant.util'

// import { vuexTypes } from '@/vuex'
// import walletModule from '@/vuex/wallet.module'
// import accountModule from '@/vuex/account.module'

// import { createLocalVue, shallowMount } from '@vue/test-utils'

// import { MockHelper } from '@/test'

// // HACK: https://github.com/vuejs/vue-test-utils/issues/532, waiting for
// // Vue 2.6 so everything get fixed
// Vue.config.silent = true

// const localVue = createLocalVue()
// localVue.use(VueRouter)
// localVue.use(Vuex)

// describe('Issuance component unit test', () => {
//   let mockHelper
//   let operationsResource

//   let getters
//   let store
//   let wrapper

//   beforeEach(() => {
//     mockHelper = new MockHelper()
//     operationsResource = mockHelper.getHorizonResourcePrototype('operations')

//     sinon.stub(xdrEnumToConstant, 'arguments').returns({})

//     getters = {
//       ...walletModule.getters,
//       ...accountModule.getters
//     }
//     sinon.stub(getters, vuexTypes.wallet).returns(
//       mockHelper.getMockWallet()
//     )
//     sinon.stub(getters, vuexTypes.account).returns({
//       accountId: mockHelper.getMockWallet().accountId,
//       accountType: 'AccountTypeSyndycate'
//     })
//     store = new Vuex.Store({
//       getters
//     })
//     wrapper = shallowMount(Issuance, {
//       store,
//       localVue
//     })
//   })

//   afterEach(() => {
//     sinon.restore()
//   })

//   it('loadHistoryWrapper() calls the
// horizon.operations.getPage() with the correct params', async () => {
//     const spy = sinon.stub(operationsResource, 'getPage').resolves({
//       data: [{}]
//     })

//     await wrapper.vm.loadHistoryWrapper()

//     expect(spy
//       .withArgs({
//         account_id: mockHelper.getMockWallet().accountId,
//         operation_type: OPERATION_TYPES.createIssuanceRequest
//       })
//       .calledOnce
//     ).to.be.true
//   })

//   it('loadHistory() changes issuance history data after loading',
// async () => {
//     const sampleData = [{
//       asset: 'BTC',
//       participants: []
//     }]

//     wrapper.vm.loadHistory(sampleData)

//     expect(wrapper.vm.issuanceHistory).to.not.equal(null)
//   })
// })
