import FullDescriptionStepForm from './full-description-step-form'

import { createLocalVue, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()

describe('Full description step form', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('created hook', () => {
    it('calls populateForm only if request was passed as a prop', () => {
      sandbox.stub(FullDescriptionStepForm.methods, 'populateForm')

      shallowMount(FullDescriptionStepForm, { localVue })
      expect(FullDescriptionStepForm.methods.populateForm)
        .to.have.not.been.called

      shallowMount(FullDescriptionStepForm, {
        localVue,
        propsData: {
          request: { id: '1' },
        },
      })
      expect(FullDescriptionStepForm.methods.populateForm)
        .to.have.been.calledOnce
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(FullDescriptionStepForm, { localVue })
    })

    describe('computed property', () => {
      describe('youtubeId', () => {
        it('returns correct YouTube video ID', () => {
          wrapper.setData({
            form: { youtubeVideo: 'youtube-video-id' },
          })
          expect(wrapper.vm.youtubeId).to.equal('youtube-video-id')

          wrapper.setData({
            form: {
              youtubeVideo: 'https://www.youtube.com/watch?v=video-id',
            },
          })
          expect(wrapper.vm.youtubeId).to.equal('video-id')

          wrapper.setData({
            form: { youtubeVideo: 'https://youtu.be/id' },
          })
          expect(wrapper.vm.youtubeId).to.equal('id')
        })
      })
    })

    describe('method', () => {
      describe('populateForm', () => {
        it('properly sets request prop fields to form property', () => {
          wrapper.setProps({
            request: { youtubeVideoId: 'youtube-video-id' },
            saleDescription: 'Full description',
          })

          wrapper.vm.populateForm()

          expect(wrapper.vm.form.youtubeVideo).to.equal('youtube-video-id')
          expect(wrapper.vm.form.description).to.equal('Full description')
        })
      })

      describe('submit', () => {
        it('emits submit event with correct payload', () => {
          sandbox.stub(wrapper.vm, 'isFormValid').returns(true)
          wrapper.setData({
            form: {
              youtubeVideo: 'youtube-video-id',
              description: 'Some description',
            },
          })

          wrapper.vm.submit()

          expect(wrapper.emitted('submit')).to.exist
          expect(wrapper.emitted('submit')[0]).to.deep.equal([{
            youtubeId: 'youtube-video-id',
            description: 'Some description',
          }])
        })
      })

      describe('setConfirmationState', () => {
        it('calls showConfirmation and emitDisabledState methods', () => {
          sandbox.stub(wrapper.vm, 'showConfirmation')
          sandbox.stub(wrapper.vm, 'emitDisabledState')

          wrapper.vm.setConfirmationState()

          expect(wrapper.vm.showConfirmation).to.have.been.calledOnce
          expect(wrapper.vm.emitDisabledState).to.have.been.calledOnce
        })
      })

      describe('emitDisabledState', () => {
        it('emits update isDisabled property event with correct payload', () => {
          wrapper.vm.emitDisabledState()

          expect(wrapper.emitted('update:isDisabled')).to.exist
          expect(wrapper.emitted('update:isDisabled')[0])
            .to.deep.equal([true])
        })
      })

      describe('emitEnabledState', () => {
        it('emits update isDisabled property event with correct payload', () => {
          wrapper.vm.emitEnabledState()

          expect(wrapper.emitted('update:isDisabled')).to.exist
          expect(wrapper.emitted('update:isDisabled')[0])
            .to.deep.equal([false])
        })
      })
    })
  })
})
