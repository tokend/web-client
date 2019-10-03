import MovementsHistoryModule from './index'
import MovementsHistoryModuleStore from '@/vuex/movements-history.module'

import Vuex from 'vuex'
import { createLocalVue, shallowMount } from '@vue/test-utils'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Movements history module', () => {
  const props = {
    assetCode: 'BTC',
  }

  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        MovementsHistoryModuleStore,
      },
    })
  })

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

    describe('method', () => {
      describe('loadMovementsFirstPage', () => {
        it('calls loadShareMovements method', async () => {
          sinon.stub(wrapper.vm, 'loadShareMovements')
            .withArgs(props.assetCode)
            .resolves()
          await wrapper.vm.loadMovementsFirstPage()

          expect(wrapper.vm.loadShareMovements).to.have.been.calledOnce

          wrapper.vm.loadShareMovements.restore()
        })

        it('sets isMovementsLoaded property to true if loading was succeded',
          async () => {
            sinon.stub(wrapper.vm, 'loadShareMovements')
              .withArgs()
              .resolves()

            await wrapper.vm.loadMovementsFirstPage(props.assetCode)

            expect(wrapper.vm.isMovementsLoaded).to.be.true

            wrapper.vm.loadShareMovements.restore()
          })

        it('calls ErrorHandler.processWithoutFeedback', async () => {
          sinon.stub(wrapper.vm, 'loadShareMovements')
            .throws()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadMovementsFirstPage()

          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce
          expect(wrapper.vm.isMovementsLoadFailed).to.be.true

          wrapper.vm.loadShareMovements.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })

        it('sets isMovementsLoadFailed to true', async () => {
          sinon.stub(wrapper.vm, 'loadShareMovements')
            .throws()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadMovementsFirstPage()

          expect(wrapper.vm.isMovementsLoadFailed).to.be.true

          wrapper.vm.loadShareMovements.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })
      })
    })
  })
})
