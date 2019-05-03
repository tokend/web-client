import MovementsHistoryModule from './index'
import { movementsHistoryModule } from './store/index'

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
        'movements-history': movementsHistoryModule,
      },
    })
  })

  describe('created hook', () => {
    beforeEach(() => {
      sinon.stub(MovementsHistoryModule.methods, 'loadBalances').resolves()
    })

    afterEach(() => {
      MovementsHistoryModule.methods.loadBalances.restore()
    })

    it('calls loadBalances action', () => {
      shallowMount(MovementsHistoryModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(MovementsHistoryModule.methods.loadBalances)
        .to.have.been.calledOnce
    })

    it('sets isInitialized property to true if actions in Created were succeded',
      async () => {
        const wrapper = await shallowMount(MovementsHistoryModule, {
          store,
          localVue,
          propsData: props,
        })

        expect(wrapper.vm.isInitialized).to.be.true
      })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      sinon.stub(MovementsHistoryModule, 'created').resolves()

      wrapper = shallowMount(MovementsHistoryModule, {
        store,
        localVue,
        propsData: props,
      })
    })

    afterEach(() => {
      MovementsHistoryModule.created.restore()
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

        it('sets isMovementsLoaded property to true if loading was succeded',
          async () => {
            sinon.stub(wrapper.vm, 'loadMovements')
              .withArgs(props.assetCode)
              .resolves()

            await wrapper.vm.loadMovementsFirstPage()

            expect(wrapper.vm.isMovementsLoaded).to.be.true

            wrapper.vm.loadMovements.restore()
          })

        it('calls ErrorHandler.processWithoutFeedback', async () => {
          sinon.stub(wrapper.vm, 'loadMovements')
            .throws()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadMovementsFirstPage()

          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce
          expect(wrapper.vm.isMovementsLoadFailed).to.be.true

          wrapper.vm.loadMovements.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })

        it('sets isMovementsLoadFailed to true', async () => {
          sinon.stub(wrapper.vm, 'loadMovements')
            .throws()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadMovementsFirstPage()

          expect(wrapper.vm.isMovementsLoadFailed).to.be.true

          wrapper.vm.loadMovements.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })
      })
    })
  })
})
