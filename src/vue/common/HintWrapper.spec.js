import HintWrapper from './HintWrapper'
import { mount } from '@vue/test-utils'

describe('HintWrapper component test', () => {
  it('template properly renders the hint provided through props', () => {
    const hint = 'My awesome hint'
    const wrapper = mount(HintWrapper, { propsData: { hint } })

    const renderedHint = wrapper
      .find('.hint-wrapper__hint-text')
      .text()

    expect(renderedHint).to.equal(hint)
  })

  it('template has the --decorated modifier by default', () => {
    const hint = 'My awesome hint'
    const wrapper = mount(HintWrapper, { propsData: { hint } })

    expect(wrapper.classes()).to.include('hint-wrapper--decorated')
  })

  it('template doesn\'t have the --decorated modifier if the we said so', () => {
    const hint = 'My awesome hint'
    const wrapper = mount(HintWrapper, {
      propsData: {
        hint,
        decorated: false
      }
    })

    expect(wrapper.classes()).to.not.include('hint-wrapper--decorated')
  })
})
