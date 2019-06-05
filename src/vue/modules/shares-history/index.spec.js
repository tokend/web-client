import SharesHistoryModule from './index'
import { sharesHistoryModule } from './store/index'

import Vuex from 'vuex'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { ErrorHandler } from '@/js/helpers/error-handler'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Shares history module', () => {
  const props = {
    assetCode: 'BTC',
  }

  let store

  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        'shares-history': sharesHistoryModule,
      },
    })
  })

  describe('created hook', () => {
    beforeEach(() => {
      sinon.stub(SharesHistoryModule.methods, 'loadBalances').resolves()
    })

    afterEach(() => {
      SharesHistoryModule.methods.loadBalances.restore()
    })

    it('calls loadBalances action', () => {
      shallowMount(SharesHistoryModule, {
        localVue,
        store,
        propsData: props,
      })

      expect(SharesHistoryModule.methods.loadBalances)
        .to.have.been.calledOnce
    })

    it('sets isInitialized property to true if actions in Created were succeded',
      async () => {
        const wrapper = await shallowMount(SharesHistoryModule, {
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
      sinon.stub(SharesHistoryModule, 'created').resolves()

      wrapper = shallowMount(SharesHistoryModule, {
        store,
        localVue,
        propsData: props,
      })
    })

    afterEach(() => {
      SharesHistoryModule.created.restore()
    })

    describe('method', () => {
      describe('loadSharesFirstPage', () => {
        it('calls loadShares method', async () => {
          sinon.stub(wrapper.vm, 'loadShares')
            .withArgs(props.assetCode)
            .resolves()

          await wrapper.vm.loadSharesFirstPage()

          expect(wrapper.vm.loadShares).to.have.been.calledOnce

          wrapper.vm.loadShares.restore()
        })

        it('sets isSharesLoaded property to true if loading was succeded',
          async () => {
            sinon.stub(wrapper.vm, 'loadShares')
              .withArgs(props.assetCode)
              .resolves()

            await wrapper.vm.loadSharesFirstPage()

            expect(wrapper.vm.isSharesLoaded).to.be.true

            wrapper.vm.loadShares.restore()
          })

        it('calls ErrorHandler.processWithoutFeedback', async () => {
          sinon.stub(wrapper.vm, 'loadShares')
            .throws()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadSharesFirstPage()

          expect(ErrorHandler.processWithoutFeedback)
            .to.have.been.calledOnce
          expect(wrapper.vm.isSharesLoadFailed).to.be.true

          wrapper.vm.loadShares.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })

        it('sets isSharesLoadFailed to true', async () => {
          sinon.stub(wrapper.vm, 'loadShares')
            .throws()
          sinon.stub(ErrorHandler, 'processWithoutFeedback')

          await wrapper.vm.loadSharesFirstPage()

          expect(wrapper.vm.isSharesLoadFailed).to.be.true

          wrapper.vm.loadShares.restore()
          ErrorHandler.processWithoutFeedback.restore()
        })
      })
    })
  })
})
