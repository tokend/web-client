import CoinpaymentsForm from './coinpayments-form'

import Vue from 'vue'
import Vuex from 'vuex'
import Vuelidate from 'vuelidate'

import { createLocalVue, mount } from '@vue/test-utils'

Vue.config.silent = true

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.use(Vuex)

describe('CoinpaymentsForm', () => {
  const sampleCoinpaymentsFormData = {
    form: {
      amount: 10,
    },
    isFailed: false,
  }

  afterEach(() => {
    sinon.restore()
  })

  describe('validation rules assigned correctly', () => {
    let wrapper

    beforeEach(() => {
      wrapper = mount(CoinpaymentsForm, {
        localVue,
        data: () => Object.assign({}, sampleCoinpaymentsFormData),
        sync: false,
      })
    })

    const expectedResults = {
      amount: ['required', 'amountRange'],
    }

    for (const [model, rules] of Object.entries(expectedResults)) {
      it(`${model} model is validating by proper set of rules`, () => {
        expect(Object.keys(wrapper.vm.$v.form[model].$params))
          .to.deep.equal(rules)
      })
    }

    const fieldBindings = {
      '#coinpayments-amount': 'amount',
    }

    for (const [selector, model] of Object.entries(fieldBindings)) {
      it(`$v.form.${model} is touched after blur event emitted on ${selector}`, () => {
        const spy = sinon.stub(wrapper.vm, 'touchField')
        wrapper.find(selector).vm.$emit('blur')

        expect(spy.calledOnce).to.be.true
      })
    }
  })
})
