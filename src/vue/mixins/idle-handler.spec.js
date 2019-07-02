import IdleHandlerMixin from './idle-handler'

import Vuex from 'vuex'
import VueRouter from 'vue-router'
import { mount, createLocalVue } from '@vue/test-utils'
import { vuexTypes } from '@/vuex/types'

import cloneDeep from 'lodash/cloneDeep'

describe('idle-handler.js mixin', () => {
  describe('while included', () => {
    let wrapper
    beforeEach(() => {
      const localVue = createLocalVue()
      localVue.use(Vuex)
      localVue.use(VueRouter)

      const component = { template: '<div></div>' }
      const store = new Vuex.Store({
        actions: {
          [vuexTypes.CLEAR_STATE]: sinon.stub().returns('CLEAR_STATE'),
        },
        getters: {
          [vuexTypes.isLoggedIn]: sinon.stub().returns('isLoggedIn'),
        },
      })
      const router = new VueRouter({
        mode: 'history',
        routes: [],
      })

      wrapper = mount(component, {
        mixins: [IdleHandlerMixin],
        localVue,
        store,
        router,
      })
    })

    it('contains all needed properties and methods', () => {
      expect(wrapper.vm.isLoggedIn, 'isLoggedIn getter').to.exist
      expect(wrapper.vm.clearState, 'clearState action').to.exist
      expect(wrapper.vm.reloadApp, 'reloadApp method').to.exist
      expect(wrapper.vm.$router, '$router').to.exist
      expect(wrapper.vm.$route, '$route').to.exist
    })
  })

  // Some bad practice tests approaching. It came hardly possible to check
  // onIdle() hook in a any readable way, so got the following workarounds.
  // All the reassigned hooks, methods, properties and so on should be checked
  // for presence in the tests above

  describe('while raw', () => {
    let mixin
    beforeEach(() => {
      mixin = cloneDeep(IdleHandlerMixin)
      mixin.isLoggedIn = undefined
      mixin.clearState = sinon.spy()
      mixin.reloadApp = sinon.spy()
      mixin.$router = { push: sinon.spy() }
      mixin.$route = { name: 'SOME_ROUTE_NAME' }
    })

    describe('on onIdle() hook', () => {
      it('logs the user out and reloads the application', () => {
        mixin.isLoggedIn = true
        window.focus()

        mixin.onIdle()

        expect(mixin.clearState).to.has.been.calledOnceWithExactly()
        expect(mixin.reloadApp).to.has.been.calledOnceWithExactly()
        expect(mixin.$router.push).to.has.been.calledOnceWithExactly({
          name: 'SOME_ROUTE_NAME',
          query: { isIdle: true },
        })
      })

      it('does nothing if user is not logged in', () => {
        mixin.isLoggedIn = false

        mixin.onIdle()

        expect(mixin.clearState).to.has.not.been.called
        expect(mixin.reloadApp).to.has.not.been.called
        expect(mixin.$router.push).to.has.not.been.called
      })
    })
  })
})
