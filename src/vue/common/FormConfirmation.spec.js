import FormConfirmation from './FormConfirmation'

import { mount, createLocalVue } from '@vue/test-utils'

describe('FormConfirmation component test', () => {
  it('template properly renders the data provided through props', () => {
    const globalizeStub = sinon.stub()
    globalizeStub
      .withArgs('form-confirmation.message-text-custom')
      .returns('Please ensure everything is OK!')
      .withArgs('form-confirmation.button-text-ok-custom')
      .returns('I\'m okay, let\'s go!')
      .withArgs('form-confirmation.button-text-cancel-custom')
      .returns('!WOW, wait please')
    const localVue = createLocalVue()
    localVue.filter('globalize', globalizeStub)

    const wrapper = mount(FormConfirmation, {
      propsData: {
        messageId: 'form-confirmation.message-text-custom',
        okButtonTextId: 'form-confirmation.button-text-ok-custom',
        cancelButtonTextId: 'form-confirmation.button-text-cancel-custom',
      },
      localVue,
    })

    expect(wrapper.find('.form-confirmation__msg').text())
      .to.equal('Please ensure everything is OK!')

    expect(wrapper.find('.form-confirmation__ok-btn').text())
      .to.equal('I\'m okay, let\'s go!')

    expect(wrapper.find('.form-confirmation__cancel-btn').text())
      .to.equal('!WOW, wait please')
  })

  it('properly renders the default data if no props provided', () => {
    const globalizeStub = sinon.stub()
    globalizeStub
      .withArgs('form-confirmation.message-text-default')
      .returns('Please recheck the form before confirmation')
      .withArgs('form-confirmation.button-text-ok')
      .returns('Confirm')
      .withArgs('form-confirmation.button-text-cancel')
      .returns('Cancel')
    const localVue = createLocalVue()
    localVue.filter('globalize', globalizeStub)

    const wrapper = mount(FormConfirmation, { localVue })

    expect(wrapper.find('.form-confirmation__msg').text())
      .to.equal('Please recheck the form before confirmation')

    expect(wrapper.find('.form-confirmation__ok-btn').text())
      .to.equal('Confirm')

    expect(wrapper.find('.form-confirmation__cancel-btn').text())
      .to.equal('Cancel')
  })

  it('template disables the OK and cancel buttons if isPending is true', () => {
    const wrapper = mount(FormConfirmation, {
      propsData: { isPending: true },
      localVue: createLocalVue(),
    })
    const okBtn = wrapper.find('.form-confirmation__ok-btn')
    const cancelBtn = wrapper.find('.form-confirmation__cancel-btn')

    expect(okBtn.attributes('disabled')).to.equal('disabled')
    expect(cancelBtn.attributes('disabled')).to.equal('disabled')
  })

  it('template enables the OK and cancel buttons if isPending is false', () => {
    sinon.stub(FormConfirmation, 'created')
    const wrapper = mount(FormConfirmation, {
      propsData: { isPending: false },
      localVue: createLocalVue(),
    })
    const okBtn = wrapper.find('.form-confirmation__ok-btn')
    const cancelBtn = wrapper.find('.form-confirmation__cancel-btn')

    expect(okBtn.attributes('disabled')).to.be.undefined
    expect(cancelBtn.attributes('disabled')).to.be.undefined
    FormConfirmation.created.restore()
  })

  it('component emits the passed okEvent when clicking the OK button', () => {
    sinon.stub(FormConfirmation, 'created')
    const okEvent = 'okey'
    const wrapper = mount(FormConfirmation, {
      propsData: { okEvent },
      localVue: createLocalVue(),
    })

    wrapper
      .find('.form-confirmation__ok-btn')
      .trigger('click')

    expect(wrapper.emitted()[okEvent]).to.exist
    FormConfirmation.created.restore()
  })

  it('component emits the passed cancelEvent when clicking the cancel button', () => {
    sinon.stub(FormConfirmation, 'created')
    const cancelEvent = 'cancel'
    const wrapper = mount(FormConfirmation, {
      propsData: { cancelEvent },
      localVue: createLocalVue(),
    })

    wrapper
      .find('.form-confirmation__cancel-btn')
      .trigger('click')

    expect(wrapper.emitted()[cancelEvent]).to.exist
    FormConfirmation.created.restore()
  })
})
