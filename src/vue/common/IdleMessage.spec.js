import IdleMessageComponent from './IdleMessage'
import VueRouter from 'vue-router'

import { createLocalVue, shallowMount } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(VueRouter)

describe('idle-message component', () => {
  describe('on created hook', () => {
    it('tries to show idle notification message message and being set up correctly', () => {
      sinon.stub(IdleMessageComponent.methods, 'tryShowMessageOnce')

      const wrp = shallowMount(IdleMessageComponent, { localVue })

      expect(IdleMessageComponent.methods.tryShowMessageOnce)
        .to.have.been.calledOnce
      expect(wrp.vm.isMessageShown).to.equal(false)

      IdleMessageComponent.methods.tryShowMessageOnce.restore()
    })
  })

  describe('during life-cycle', () => {
    let wrapper
    beforeEach(() => {
      const router = new VueRouter({
        mode: 'history',
        routes: [],
      })
      wrapper = shallowMount(IdleMessageComponent, { localVue, router })
    })

    describe('on tryShowMessageOnce() call', () => {
      beforeEach(() => {
        sinon.stub(wrapper.vm, 'queryHasIsIdle')
        wrapper.setData({ isMessageShown: false })
        sinon.stub(wrapper.vm, 'cleanQueryIsIdle')
      })

      it('shows the message and prevents from showing it for the second time if isIdle=true present in query', () => {
        wrapper.vm.queryHasIsIdle.returns(true)

        wrapper.vm.tryShowMessageOnce()

        expect(wrapper.vm.queryHasIsIdle).to.has.been.calledOnce
        expect(wrapper.vm.isMessageShown).to.equal(true)
        expect(wrapper.vm.cleanQueryIsIdle).to.has.been.calledOnce
      })

      it('does nothing if isIdle=true absent in query', () => {
        wrapper.vm.queryHasIsIdle.returns(false)

        wrapper.vm.tryShowMessageOnce()

        expect(wrapper.vm.queryHasIsIdle).to.has.been.called
        expect(wrapper.vm.isMessageShown).to.equal(false)
        expect(wrapper.vm.cleanQueryIsIdle).to.has.not.been.called
      })
    })

    describe('on queryHasIsIdle() call', () => {
      describe('returns true if isIdle=true present in query', () => {
        const testCases = [
          { isIdle: true },
          { redirectPath: 'isIdle=true' },
          { redirectPath: '?isIdle=true' },
          { redirectPath: '/some_path?isIdle=true' },
          {
            isIdle: true,
            redirectPath: '/some_path?isIdle=false',
          },
          { redirectPath: '/some_path?someParam=true&isIdle=true' },
        ]

        for (const testCase of testCases) {
          it(JSON.stringify(testCase), () => {
            const result = wrapper.vm.queryHasIsIdle(testCase)

            expect(result).to.equal(true)
          })
        }
      })

      describe('returns false if no isIdle=true present in query', () => {
        const testCases = [
          {},
          { isIdle: false },
          { redirectPath: {} },
          { redirectPath: '' },
          { redirectPath: '/some_path?isIdle=false' },
          {
            isIdle: false,
            redirectPath: '/some_path?isIdle=false',
          },
          '',
          '{}',
        ]

        for (const testCase of testCases) {
          it(JSON.stringify(testCase), () => {
            const result = wrapper.vm.queryHasIsIdle(testCase)

            expect(result).to.equal(false)
          })
        }
      })
    })

    describe('on cleanQueryIsIdle() call', () => {
      describe('redirects to the same route with no isIdle present in query', () => {
        const testCases = [
          {
            routerQuery: { isIdle: true },
            expectedQuery: {},
          },
          {
            routerQuery: { redirectPath: 'isIdle=true' },
            expectedQuery: { redirectPath: '' },
          },
          {
            routerQuery: { redirectPath: '?isIdle=true' },
            expectedQuery: { redirectPath: '' },
          },
          {
            routerQuery: { redirectPath: '/some_path?isIdle=true' },
            expectedQuery: { redirectPath: '/some_path' },
          },
          {
            routerQuery: {
              isIdle: false,
              redirectPath: '/some_path?isIdle=false',
            },
            expectedQuery: { redirectPath: '/some_path' },
          },
          {
            routerQuery: {
              isIdle: true,
              redirectPath: '/some_path',
            },
            expectedQuery: { redirectPath: '/some_path' },
          },
          {
            routerQuery: { redirectPath: '/some_path?someParam=true&isIdle=true' },
            expectedQuery: { redirectPath: '/some_path?someParam=true' },
          },
        ]

        for (const testCase of testCases) {
          it(JSON.stringify(testCase.routerQuery), () => {
            sinon.stub(wrapper.vm.$router, 'push')

            wrapper.vm.cleanQueryIsIdle(testCase.routerQuery)

            expect(wrapper.vm.$router.push).to.has.been.calledWithMatch({
              query: testCase.expectedQuery,
            })
          })
        }
      })
    })
  })
})
