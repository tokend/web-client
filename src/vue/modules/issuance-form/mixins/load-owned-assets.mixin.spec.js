import LoadOwnedAssetsMixin from './load-owned-assets.mixin'

import { mount, createLocalVue } from '@vue/test-utils'

import { api } from '@/api'
import { Asset } from '../wrappers/asset'

const localVue = createLocalVue()

const Component = {
  template: `<div></div>`,
}

describe('Load assets mixin', () => {
  let sandbox
  let wrapper

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    wrapper = mount(Component, {
      mixins: [LoadOwnedAssetsMixin],
      localVue,
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('method', () => {
    describe('loadOwnedAssets', () => {
      it('calls api.getWithSignature method with provided params and sets assets property',
        async () => {
          sandbox.stub(api, 'get').resolves({
            data: {
              balances: [
                { asset: { id: 'USD', owner: { id: 'SOME_ACCOUNT_ID' } } },
                { asset: { id: 'BTC' } },
              ],
            },
          })

          await wrapper.vm.loadOwnedAssets('SOME_ACCOUNT_ID')

          expect(api.get)
            .to.have.been.calledOnceWithExactly(
              '/v3/accounts/SOME_ACCOUNT_ID',
              { include: ['balances.asset'] }
            )
          expect(wrapper.vm.ownedAssets).to.deep.equal([
            new Asset({ id: 'USD', owner: { id: 'SOME_ACCOUNT_ID' } }),
          ])
        }
      )
    })
  })
})
