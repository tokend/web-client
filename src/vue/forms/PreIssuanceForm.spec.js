/* eslint-disable */
// import UploadPreIssuanceForm from './UploadPreIssuanceForm'

// import Vuex from 'vuex'

// import { base } from '@tokend/js-sdk'

// import { createLocalVue, shallowMount } from '@vue/test-utils'

// import { MockHelper, MockWrapper } from '@/test'

// import { ripple } from '@/vue/directives/ripple'
// import { globalize } from '@/vue/filters/globalize'
// import { formatMoney } from '@/vue/filters/formatMoney'

// import { vuexTypes } from '@/vuex'
// import accountModule from '@/vuex/account.module'

// import config from '@/config'

// const localVue = createLocalVue()
// localVue.use(Vuex)
// localVue.directive('ripple', ripple)
// localVue.filter('globalize', globalize)
// localVue.filter('formatMoney', formatMoney)

// describe('UploadPreIssuanceForm component unit test', () => {
//   afterEach(() => {
//     sinon.restore()
//   })

//   describe('methods', () => {
//     const sampleIssuanceData = {
//       userOwnedTokens: [{
//         code: 'PLT'
//       }],
//       issuances: [{
//         asset: 'PLT',
//         amount: 10
//       }]
//     }

//     let wrapper
//     let mockHelper
//     let sampleBalanceData
//     let accountResource
//     let spySubmitOperations
//     let store

//     beforeEach(() => {
//       mockHelper = new MockHelper()

//       sampleBalanceData = {
//         asset: 'PLT',
//         balanceId: 'BCQOBAIMVNNH7RHZTD4OVSRUX2W575VUK4RUYELRHDPXSXJ5TMS2BHAV',
//         assetDetails: {
//           owner: mockHelper.getMockAccount().id,
//           ...sampleIssuanceData.userOwnedTokens[0]
//         }
//       }

//       accountResource = mockHelper.getHorizonResourcePrototype('account')
//       const transactionsResource =
//         mockHelper.getHorizonResourcePrototype('transactions')

//       spySubmitOperations = sinon.stub(transactionsResource,
//         'submitOperations').resolves()

//       const getters = accountModule.getters
//       sinon.stub(getters, vuexTypes.account)
//         .returns(mockHelper.getMockAccount())

//       store = new Vuex.Store({
//         getters
//       })
//       sinon.stub(UploadPreIssuanceForm, 'created').resolves()
//       wrapper = shallowMount(UploadPreIssuanceForm, {
//         store,
//         localVue,
//         data: _ => Object.assign({}, sampleIssuanceData),
//         sync: false
//       })
//     })

//     it('loadUserOwnedTokens() calls the horizon.account.getDetails() with the correct params', async () => {
//       const spy = sinon.stub(accountResource, 'getDetails').resolves(
//         MockWrapper.makeHorizonResponse([sampleBalanceData])
//       )

//       await wrapper.vm.loadUserOwnedTokens()

//       expect(spy
//         .withArgs(mockHelper.getMockAccount().id)
//         .calledOnce
//       ).to.be.true
//     })

//     it('loadUserOwnedTokens() method is called inside created hook', () => {
//       sinon.restore()
//       const spy = sinon.stub(
//         UploadPreIssuanceForm.methods, 'loadUserOwnedTokens'
//       )

//       shallowMount(UploadPreIssuanceForm, {
//         store,
//         localVue
//       })

//       expect(spy.calledOnce).to.be.true
//     })

//     it('loadUserOwnedTokens() changes user tokens data after loading', async () => {
//       sinon.stub(accountResource, 'getDetails').resolves(
//         MockWrapper.makeHorizonResponse([sampleBalanceData])
//       )
//       wrapper.setData({ userOwnedTokens: null })

//       await wrapper.vm.loadUserOwnedTokens()

//       expect(wrapper.vm.userOwnedTokens).to.not.equal(null)
//     })

//     it('submit() calls horizon.submitOperations()', async () => {
//       sinon.stub(wrapper.vm, 'isNullAssetSigner')
//         .returns(false)
//       sinon.stub(base.PreIssuanceRequestOpBuilder,
//         'createPreIssuanceRequestOp').returns({})

//       await wrapper.vm.submit()
//       expect(spySubmitOperations.calledOnce).to.be.true
//     })

//     it('submit() does not submit transaction if an asset has no signers', async () => {
//       sinon.stub(wrapper.vm, 'isNullAssetSigner')
//         .returns(true)
//       await wrapper.vm.submit()
//       expect(spySubmitOperations.notCalled).to.be.true
//     })

//     it('isAssetDefined() returns true if the user owns certain asset', () => {
//       const response = wrapper.vm.isAssetDefined(
//         sampleIssuanceData.userOwnedTokens[0].code
//       )
//       expect(response).to.be.true
//     })

//     it('isAssetDefined() returns false if the user does not own certain asset', () => {
//       const response = wrapper.vm.isAssetDefined('Sample Token')
//       expect(response).to.be.false
//     })

//     it('isNullAssetSigner() returns true if the asset has no pre-issued signers', () => {
//       wrapper.setData({
//         userOwnedTokens: [{
//           code: 'PLT',
//           preissuedAssetSigner: config.NULL_ASSET_SIGNER
//         }]
//       })
//       const response = wrapper.vm.isNullAssetSigner('PLT')
//       expect(response).to.be.true
//     })

//     it('isNullAssetSigner() returns false if the asset has a pre-issued signer', () => {
//       wrapper.setData({
//         userOwnedTokens: [{
//           code: 'PLT',
//           preissuedAssetSigner: mockHelper.getMockAccount().id
//         }]
//       })
//       const response = wrapper.vm.isNullAssetSigner('PLT')
//       expect(response).to.be.false
//     })

//     it('parsePreIssuances() converts pre-issuances and sets them to the issuances property', () => {
//       wrapper.setData({
//         issuances: []
//       })
//       const preIssuances = [{
//         preEmission: '00000003504c54000000000005f5e10042c5f77f000000408e138ec30b5f7aaecfcb42436868c04430868ed4847184a583bff7473f1deac5c519980bd7210afe77df44eadce3c2deada7da57b38aded1379ad2051be88d030000001437743250577a7939527a324a4d3253466d416f7800000000',
//         used: false
//       }]
//       wrapper.vm.parsePreIssuances(preIssuances)
//       expect(wrapper.vm.issuances.length).to.not.equal(0)
//     })
//   })
// })
