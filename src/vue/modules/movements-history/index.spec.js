import MovementsHistoryModule from './index'

import Vuex from 'vuex'
import { createLocalVue, shallowMount } from '@vue/test-utils'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Movements history module', () => {
  const props = {
    assetCode: 'BTC',
  }

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      const $route = {
        name: 'app.movements',
      }

      wrapper = shallowMount(MovementsHistoryModule, {
        localVue,
        propsData: props,
        mocks: {
          $route,
        },
      })
    })

    describe('method', () => {
      describe('loadMovementsFirstPage', () => {
        it('calls loadMovements method', async () => {
          sinon.stub(wrapper.vm, 'loadMovements')
            .withArgs(props.assetCode)
            .resolves()

          await wrapper.vm.loadMovementsFirstPage()

          expect(wrapper.vm.loadMovements).to.have.been.calledOnce

          wrapper.vm.loadMovements.restore()
        })

        it('sets collection.isLoaded property to true if loading was succeded',
          async () => {
            sinon.stub(wrapper.vm, 'isSharesPage').returns(false)
            sinon.stub(wrapper.vm, 'loadMovements')
              .withArgs(props.assetCode)
              .resolves()

            await wrapper.vm.loadMovementsFirstPage()

            expect(wrapper.vm.collection.isLoaded).to.be.true

            wrapper.vm.loadMovements.restore()
          })

        it('calls ErrorHandler.processWithoutFeedback', async () => {
          sinon.stub(wrapper.vm, 'loadMovements')
            .throws()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadMovementsFirstPage()

          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce
          expect(wrapper.vm.collection.isFailed).to.be.true

          wrapper.vm.loadMovements.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })

        it('sets collection.isFailed to true', async () => {
          sinon.stub(wrapper.vm, 'loadMovements')
            .throws()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadMovementsFirstPage()

          expect(wrapper.vm.collection.isFailed).to.be.true

          wrapper.vm.loadMovements.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })
      })
    })
  })
})
