import InformationStepForm from './information-step-form'

import Vuelidate from 'vuelidate'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuelidate)

describe('Information step form', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('validation rules assigned correctly', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(InformationStepForm, {
        localVue,
      })
    })

    const expectedResults = {
      name: ['required', 'maxLength'],
      baseAsset: ['required'],
      capAsset: ['required'],
      startTime: ['required'],
      endTime: ['required', 'minDate'],
      softCap: ['required', 'softCapMoreThanHardCap'],
      hardCap: ['required', 'hardCapLessThanSoftCap'],
      assetsToSell: ['required', 'noMoreThanAvailableForIssuance'],
      quoteAssets: ['requiredAtLeastOne'],
    }

    for (const [model, rules] of Object.entries(expectedResults)) {
      it(`${model} model is validating by proper set of rules`, () => {
        expect(Object.keys(wrapper.vm.$v.form[model].$params))
          .to.deep.equal(rules)
      })
    }

    const fieldBindings = {
      '[name=create-sale-name]': 'name',
      '[name=create-sale-start-time]': 'startTime',
      '[name=create-sale-end-time]': 'endTime',
      '[name=create-sale-soft-cap]': 'softCap',
      '[name=create-sale-hard-cap]': 'hardCap',
      '[name=create-sale-assets-to-sell]': 'assetsToSell',
    }

    for (const [selector, model] of Object.entries(fieldBindings)) {
      it(`$v.form.${model} is touched after blur event emitted on ${selector}`, () => {
        sandbox.stub(wrapper.vm, 'touchField')

        wrapper.find(selector).vm.$emit('blur')

        expect(wrapper.vm.touchField.calledOnce).to.be.true
      })
    }
  })

  describe('created hook', () => {
    it('calls populateForm only if request was passed as a prop', () => {
      sandbox.stub(InformationStepForm.methods, 'populateForm')

      shallowMount(InformationStepForm, { localVue })
      expect(InformationStepForm.methods.populateForm)
        .to.have.not.been.called

      shallowMount(InformationStepForm, {
        localVue,
        propsData: { request: { id: '1' } },
      })
      expect(InformationStepForm.methods.populateForm)
        .to.have.been.calledOnce
    })

    it('sets base and cap asset properties if request was not passed',
      () => {
        const wrapper = shallowMount(InformationStepForm, {
          localVue,
          propsData: {
            ownedAssets: [
              { id: 'TKN' },
              { id: 'BTC' },
            ],
            baseAssets: [
              { id: 'USD' },
            ],
          },
        })

        expect(wrapper.vm.form.baseAsset).to.deep.equal({ id: 'TKN' })
        expect(wrapper.vm.form.capAsset).to.deep.equal({ id: 'USD' })
      }
    )
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(InformationStepForm, { localVue })
    })

    describe('computed property', () => {
      describe('priceForAsset', () => {
        it('calculates price for single aset correctly', () => {
          wrapper.setData({
            form: {
              hardCap: '100.000000',
              assetsToSell: '20.000000',
            },
          })

          expect(wrapper.vm.priceForAsset.value).to.equal('5.000000')
        })
      })
    })

    describe('method', () => {
      describe('populateForm', () => {
        it('properly sets request prop fields to form property', async () => {
          sandbox.stub(wrapper.vm, 'loadBaseAssetsByQuote').resolves([])
          wrapper.setProps({
            request: {
              name: 'My sale',
              baseAsset: 'TKN',
              defaultQuoteAsset: 'USD',
              startTime: '2019-04-02T14:00:18Z',
              endTime: '2019-04-10T14:00:18Z',
              softCap: '100.000000',
              hardCap: '200.000000',
              assetsToSell: '10.000000',
              quoteAssets: ['BTC', 'ETH'],
              isWhitelisted: true,
            },
            ownedAssets: [{ code: 'TKN' }],
            baseAssets: [{ code: 'USD' }],
          })

          wrapper.vm.populateForm()
          await wrapper.vm.$nextTick()

          expect(wrapper.vm.form.name).to.equal('My sale')
          expect(wrapper.vm.form.baseAsset).to.deep.equal({ code: 'TKN' })
          expect(wrapper.vm.form.capAsset).to.deep.equal({ code: 'USD' })

          expect(wrapper.vm.form.startTime).to.equal('2019-04-02T14:00:18Z')
          expect(wrapper.vm.form.endTime).to.equal('2019-04-10T14:00:18Z')

          expect(wrapper.vm.form.softCap).to.equal('100.000000')
          expect(wrapper.vm.form.hardCap).to.equal('200.000000')

          expect(wrapper.vm.form.assetsToSell).to.equal('10.000000')
          expect(wrapper.vm.form.quoteAssets).to.deep.equal(['BTC', 'ETH'])
          expect(wrapper.vm.form.isWhitelisted).to.be.true
        })
      })

      describe('submit', () => {
        it('emits submit event with correct payload', () => {
          sandbox.stub(wrapper.vm, 'isFormValid').returns(true)
          wrapper.setData({
            form: { name: 'My sale' },
          })

          wrapper.vm.submit()

          expect(wrapper.emitted('submit')).to.exist
          expect(wrapper.emitted('submit')[0])
            .to.deep.equal([wrapper.vm.form])
        })
      })
    })
  })
})
