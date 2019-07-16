import IssuanceExplorerModule from './index'

import Vuex from 'vuex'

import { issuanceExplorerModule } from './store/index'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Issuance explorer module', () => {
  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        'issuance-explorer': issuanceExplorerModule,
      },
    })
  })

  describe('created hook', () => {
    it('calls initFirstPageLoader method', () => {
      sinon.stub(IssuanceExplorerModule.methods, 'initFirstPageLoader')

      shallowMount(IssuanceExplorerModule, {
        localVue,
        store,
      })

      expect(IssuanceExplorerModule.methods.initFirstPageLoader)
        .to.have.been.calledOnce

      IssuanceExplorerModule.methods.initFirstPageLoader.restore()
    })
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      wrapper = shallowMount(IssuanceExplorerModule, {
        store,
        localVue,
      })
    })

    describe('method', () => {
      describe('loadIssuancesFirstPage', () => {
        it('calls loadIssuances method', async () => {
          sinon.stub(wrapper.vm, 'loadIssuances').resolves()

          await wrapper.vm.loadIssuancesFirstPage()

          expect(wrapper.vm.loadIssuances).to.have.been.calledOnce

          wrapper.vm.loadIssuances.restore()
        })

        it('sets isLoaded property to true if loading was succeded', async () => {
          sinon.stub(wrapper.vm, 'loadIssuances').resolves()

          await wrapper.vm.loadIssuancesFirstPage()

          expect(wrapper.vm.isLoaded).to.be.true

          wrapper.vm.loadIssuances.restore()
        })

        it('handles the error if loading was failed', async () => {
          sinon.stub(wrapper.vm, 'loadIssuances').throws()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadIssuancesFirstPage()

          expect(wrapper.vm.isLoadFailed).to.be.true
          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce

          wrapper.vm.loadIssuances.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })
      })
    })
  })
})
