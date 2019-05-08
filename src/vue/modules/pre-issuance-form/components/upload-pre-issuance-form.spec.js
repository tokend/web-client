import UploadPreIssuanceForm from './upload-pre-issuance-form'

import Vuelidate from 'vuelidate'

import { createLocalVue, mount, shallowMount } from '@vue/test-utils'

import { Bus } from '@/js/helpers/event-bus'
import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuelidate)

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
      wrapper = mount(UploadPreIssuanceForm, { localVue })
    })

    it(`preIssuanceDocument model is validating by proper set of rules`, () => {
      expect(Object.keys(wrapper.vm.$v.preIssuanceDocument.$params))
        .to.deep.equal(['documentContainer'])
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(UploadPreIssuanceForm, { localVue })
    })

    describe('watcher', () => {
      describe('preIssuanceDocument', () => {
        it('calls extractPreIssuance method if changed value contains file',
          async () => {
            sandbox.stub(wrapper.vm, 'extractPreIssuance').resolves()

            wrapper.setData({ preIssuanceDocument: {} })
            await wrapper.vm.$nextTick()
            expect(wrapper.vm.extractPreIssuance).to.have.not.been.called

            wrapper.setData({ preIssuanceDocument: { file: 'SOME_FILE' } })
            await wrapper.vm.$nextTick()
            expect(wrapper.vm.extractPreIssuance)
              .to.have.been.calledOnceWithExactly('SOME_FILE')
          }
        )
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
  })
})
