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
})
