import { mount } from '@vue/test-utils'
import { handleClickOutsideHelper } from '@/js/helpers/handle-click-outside'

describe('handle-click-outside unit test', () => {
  it('by clicking outside passed element should be called the right callback method', () => {
    const Component = {
      data: () => ({
        called: false
      }),
      created () {
        this.attachEventListener()
      },
      methods: {
        attachEventListener () {
          handleClickOutsideHelper(
            'child',
            this.handleClickOutside
          )
        },
        handleClickOutside () {
          this.called = true
        }
      },
      template:
        `<div ref="parent" class="parent">
          <div ref="child" class="child"></div>
        </div>`
    }

    const component = mount(Component)

    component.vm.$refs.child.click()
    expect(component.vm.called).toBe(false)

    component.vm.$refs.parent.click()
    expect(component.vm.called).toBe(true)
  })
})
