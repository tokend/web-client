import UploadPreIssuanceForm from './upload-pre-issuance-form'
import { Document } from '@tokend/js-sdk'

import Vuelidate from 'vuelidate'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuelidate)
localVue.filter('globalize', sinon.stub())
localVue.directive('ripple', sinon.stub())
localVue.component('router-link', sinon.stub())

describe('Upload pre-issuance form', () => {
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
      wrapper = mount(UploadPreIssuanceForm, {
        localVue,
        propsData: {
          ownedAssets: [],
        },
      })
    })

    it('preIssuanceDocument model is validating by proper set of rules', () => {
      expect(Object.keys(wrapper.vm.$v.preIssuanceDocument.$params))
        .to.deep.equal(['nonEmptyDocument'])
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(UploadPreIssuanceForm, {
        localVue,
        propsData: {
          ownedAssets: [],
        },
      })
    })

    describe('methods', () => {
      describe('submit', () => {
        it('calls proper methods and emits proper event', async () => {
          sandbox.stub(wrapper.vm, 'createPreIssuanceRequest').resolves()
          sandbox.stub(Bus, 'success')
          sandbox.stub(wrapper.vm, 'hideConfirmation')

          await wrapper.vm.submit()

          expect(wrapper.vm.createPreIssuanceRequest)
            .to.have.been.calledOnce
          expect(Bus.success).to.have.been.calledOnce
          expect(wrapper.emitted('submit')).to.exist
          expect(wrapper.vm.hideConfirmation).to.have.been.calledOnce
        })

        it('handles a thrown error properly', async () => {
          sandbox.stub(wrapper.vm, 'createPreIssuanceRequest').rejects()
          sandbox.stub(ErrorHandler, 'process')

          await wrapper.vm.submit()

          expect(ErrorHandler.process).to.have.been.calledOnce
        })
      })
    })

    describe('onPreIssuanceDocumentChange', () => {
      it('calls extractPreIssuance method if changed value contains file',
        async () => {
          sandbox.stub(wrapper.vm, 'extractPreIssuance').resolves()

          wrapper.vm.onPreIssuanceDocumentChange(new Document())
          expect(wrapper.vm.extractPreIssuance).to.have.not.been.called

          const nonEmptyDoc = new Document({ file: 'SOME_FILE' })
          wrapper.vm.onPreIssuanceDocumentChange(nonEmptyDoc)
          expect(wrapper.vm.extractPreIssuance)
            .to.have.been.calledOnceWithExactly('SOME_FILE')
        },
      )
    })
  })
})
