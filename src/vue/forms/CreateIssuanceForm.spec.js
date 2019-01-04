/* eslint-disable */
// import CreateIssuanceForm from './CreateIssuanceForm'

// import Vuex from 'vuex'
// import Vuelidate from 'vuelidate'

// import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

// import { MockHelper, MockWrapper } from '@/test'

// import { ripple } from '@/vue/directives/ripple'
// import { globalize } from '@/vue/filters/globalize'
// import { formatMoney } from '@/vue/filters/formatMoney'

// import { vuexTypes } from '@/vuex'
// import accountModule from '@/vuex/account.module'

// const localVue = createLocalVue()
// localVue.use(Vuelidate)
// localVue.use(Vuex)
// localVue.directive('ripple', ripple)
// localVue.filter('globalize', globalize)
// localVue.filter('formatMoney', formatMoney)

// describe('CreateIssuanceForm component unit test', () => {
//   afterEach(() => {
//     sinon.restore()
//   })

//   describe('validation rules assigned correctly', () => {
//     let wrapper

//     beforeEach(() => {
//       wrapper = mount(CreateIssuanceForm, { localVue })
//     })

//     const expectedResults = {
//       asset: ['required'],
//       amount: ['required', 'amount'],
//       email: ['required', 'email'],
//       reference: ['required']
//     }

//     for (const [model, rules] of Object.entries(expectedResults)) {
//       it(`${model} model is validating by proper set of rules`, () => {
//         expect(Object.keys(wrapper.vm.$v.form[model].$params))
//           .to
//           .deep
//           .equal(rules)
//       })
//     }

//     const fieldBindings = {
//       '#create-issuance-asset': 'asset',
//       '#create-issuance-amount': 'amount',
//       '#create-issuance-email': 'email',
//       '#create-issuance-reference': 'reference'
//     }

//     for (const [selector, model] of Object.entries(fieldBindings)) {
//       it(`$v.form.${model} is touched after blur event emitted on ${selector}`, () => {
//         const spy = sinon.stub(wrapper.vm, 'touchField')

//         wrapper.find(selector).vm.$emit('blur')

//         expect(spy.calledOnce).to.be.true
//       })
//     }
//   })

//   describe('methods', () => {
//     const sampleIssuanceData = {
//       form: {
//         asset: 'Bitcoin (BTC)',
//         amount: 10,
//         email: 'foo@bar.com',
//         reference: 'ref'
//       },
//       userOwnedTokens: [{
//         code: 'BTC',
//         details: {
//           name: 'Bitcoin'
//         },
//         availableForIssuance: 100
//       }, {
//         code: 'ETH',
//         details: {
//           name: 'Ethereum'
//         },
//         availableForIssuance: 200
//       }]
//     }

//     let wrapper
//     let mockHelper

//     let accountResource
//     let spyLoadReceiverInfo
//     let spyLoadBalances
//     let spySubmitOperations

//     let sampleReceiverData
//     let sampleBalanceData

//     let store

//     beforeEach(() => {
//       mockHelper = new MockHelper()

//       accountResource = mockHelper.getHorizonResourcePrototype('account')
//       const usersResource = mockHelper.getApiResourcePrototype('users')
//       const transactionsResource =
//         mockHelper.getHorizonResourcePrototype('transactions')

//       sampleReceiverData = {
//         data: [{
//           id: mockHelper.getMockAccount().id,
//           attributes: {
//             email: 'foo@bar.com'
//           }
//         }]
//       }
//       sampleBalanceData = {
//         asset: 'BTC',
//         balanceId: 'BCQOBAIMVNNH7RHZTD4OVSRUX2W575VUK4RUYELRHDPXSXJ5TMS2BHAV',
//         assetDetails: {
//           owner: mockHelper.getMockAccount().id,
//           ...sampleIssuanceData.userOwnedTokens[0]
//         }
//       }

//       spyLoadReceiverInfo = sinon.stub(usersResource, 'getPage')
//         .resolves(MockWrapper.makeApiResponse(sampleReceiverData))
//       spyLoadBalances = sinon.stub(accountResource, 'getBalances')
//         .resolves(MockWrapper.makeHorizonResponse([sampleBalanceData]))
//       spySubmitOperations = sinon.stub(transactionsResource,
//         'submitOperations').resolves()

//       const getters = accountModule.getters
//       sinon.stub(getters, vuexTypes.account)
//         .returns(mockHelper.getMockAccount())

//       store = new Vuex.Store({
//         getters
//       })

//       sinon.stub(CreateIssuanceForm, 'created').resolves()
//       wrapper = shallowMount(CreateIssuanceForm, {
//         store,
//         localVue,
//         data: _ => Object.assign({}, sampleIssuanceData),
//         sync: false
//       })
//       sinon.stub(wrapper.vm, 'isFormValid').returns(true)
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
//       const spy = sinon.stub(CreateIssuanceForm.methods, 'loadUserOwnedTokens')

//       shallowMount(CreateIssuanceForm, {
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

//     it('ownedTokenAssets returns formatted owned assets', () => {
//       wrapper.setData({
//         userOwnedTokens: sampleIssuanceData.userOwnedTokens
//       })
//       expect(wrapper.vm.ownedTokenAssets)
//         .to.deep.equal(['Bitcoin (BTC)', 'Ethereum (ETH)'])
//     })

//     it('availableTokensAmount returns available tokens for issuance', () => {
//       wrapper.setData(sampleIssuanceData)
//       expect(wrapper.vm.availableTokensAmount)
//         .to.deep.equal({
//           value: sampleIssuanceData.userOwnedTokens[0].availableForIssuance,
//           currency: sampleIssuanceData.userOwnedTokens[0].code
//         })
//     })

//     it('submit() loads receiver account info with the correct params', async () => {
//       await wrapper.vm.submit()
//       expect(spyLoadReceiverInfo
//         .withArgs({ email: sampleIssuanceData.form.email })
//         .called
//       ).to.be.true
//     })

//     it('submit() loads receiver balances info with the correct params', async () => {
//       await wrapper.vm.submit()
//       expect(spyLoadBalances
//         .withArgs(sampleReceiverData.data[0].id)
//         .calledOnce
//       ).to.be.true
//     })

//     it('submit() calls horizon.submitOperations()', async () => {
//       await wrapper.vm.submit()
//       expect(spySubmitOperations.calledOnce).to.be.true
//     })
//   })
// })
