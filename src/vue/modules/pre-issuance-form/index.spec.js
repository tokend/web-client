import PreIssuanceFormModule from './index'

import Vuelidate from 'vuelidate'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import { ErrorHandler } from '@/js/helpers/error-handler'

import { api } from '@/api'
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
        sandbox.stub(PreIssuanceFormModule.methods, 'init').resolves()

        await shallowMount(PreIssuanceFormModule, {
          localVue,
        })

        expect(PreIssuanceFormModule.methods.init).to.have.been.calledOnce
      }
    )
  })

  describe('component', () => {
    let wrapper
    let store

    beforeEach(() => {
      sandbox.stub(PreIssuanceFormModule, 'created').resolves()
      store = new Vuex.Store({
        modules: {
          account: {
            getters: {
              accountId: () => ('SOME_ACCOUNT_ID'),
            },
          },
        },
      })

      wrapper = shallowMount(PreIssuanceFormModule, {
        store,
        localVue,
      })
    })

    describe('method', () => {
      describe('init', () => {
        it('calls load assets method, and sets isLoaded property to true',
          async () => {
            wrapper.setProps({
              config: 'SOME_CONFIG',
              wallet: { accountId: 'SOME_ACCOUNT_ID' },
            })

            sandbox.stub(wrapper.vm, 'loadOwnedAssets').resolves()

            await wrapper.vm.init()

            expect(wrapper.vm.loadOwnedAssets)
              .to.have.been.calledOnceWithExactly('SOME_ACCOUNT_ID')
            expect(wrapper.vm.isLoaded).to.be.true
          }
        )

        it('handles an error if it was thrown, and sets isLoadFailed property to true',
          async () => {
            sandbox.stub(api, 'get').throws()
            sandbox.stub(ErrorHandler, 'processWithoutFeedback')

            await wrapper.vm.init()

            expect(ErrorHandler.processWithoutFeedback)
              .to.have.been.calledOnce
            expect(wrapper.vm.isLoadFailed).to.be.false
          }
        )
      })
    })
  })
})
