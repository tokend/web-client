import MovementsHistoryModule from './index'

import Vuex from 'vuex'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import { store } from '@/vuex/index'
import { api } from '@/api'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Movements history module', () => {
  const props = {
    assetCode: 'BTC',
  }
  const response = {
    data: [],
    fetchNext: () => {},
  }

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      const $route = {
        name: 'app.movements',
      }

      wrapper = shallowMount(MovementsHistoryModule, {
        store,
        localVue,
        propsData: props,
        mocks: {
          $route,
        },
      })
    })
    after(() => api.getWithSignature.restore())

    describe('method', () => {
      describe('load', () => {
        it('calls api.getWithSignature method', async () => {
          const api = {
            getWithSignature: () => {},
          }
          sinon.stub(api, 'getWithSignature').resolves(response)

          await wrapper.vm.load()

          expect(api.getWithSignature).to.have.been.calledOnce
          // api.getWithSignature.restore()
          // sinon.restore()
        })
      })
    })
  })
})
