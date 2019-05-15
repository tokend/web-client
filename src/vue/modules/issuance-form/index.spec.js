import IssuanceFormModule from './index'

import Vuelidate from 'vuelidate'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { ErrorHandler } from '@/js/helpers/error-handler'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Vuelidate)

describe('Issuance form module', () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('created hook', () => {
    it('calls init method',
      async () => {
        sandbox.stub(IssuanceFormModule.methods, 'init').resolves()

        await shallowMount(IssuanceFormModule, {
          localVue,
        })

        expect(IssuanceFormModule.methods.init).to.have.been.calledOnce
      }
    )
  })

  describe('component', () => {
    let wrapper

    beforeEach(() => {
      const store = new Vuex.Store({
        modules: {
          account: {
            getters: {
              accountId: () => ('SOME_ACCOUNT_ID'),
            },
          },
        },
      })
      sandbox.stub(IssuanceFormModule, 'created').resolves()

      wrapper = shallowMount(IssuanceFormModule, {
        store,
        localVue,
      })
    })

    describe('method', () => {
      describe('init', () => {
        it('calls load assets method, and sets isLoaded property to true',
          async () => {
            sandbox.stub(wrapper.vm, 'loadOwnedAssets').resolves()

            await wrapper.vm.init()
            expect(wrapper.vm.loadOwnedAssets)
              .to.have.been.calledOnceWithExactly('SOME_ACCOUNT_ID')
            expect(wrapper.vm.isLoaded).to.be.true
          }
        )

        it('handles an error if it was thrown, and sets isLoadFailed property to true',
          async () => {
            sandbox.stub(wrapper.vm, 'loadOwnedAssets').throws()
            sandbox.stub(ErrorHandler, 'processWithoutFeedback')

            await wrapper.vm.init()

            expect(ErrorHandler.processWithoutFeedback)
              .to.have.been.calledOnce
            expect(wrapper.vm.isLoadFailed).to.be.true
          }
        )
      })
    })
  })
})
