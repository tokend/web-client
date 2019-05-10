import LoadOwnedAssetsMixin from './load-owned-assets.mixin'

import { ApiCaller } from '@tokend/js-sdk'

import { mount, createLocalVue } from '@vue/test-utils'

import * as Api from '@/api'
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
      beforeEach(() => {
        sandbox.stub(Api, 'api').returns(ApiCaller.getInstance())
      })

      it('calls Api.getWithSignature method with provided params and sets assets property',
        async () => {
          sandbox.stub(Api.api, 'get').resolves({
            data: {
              balances: [
                { asset: { id: 'USD', owner: { id: 'SOME_ACCOUNT_ID' } } },
                { asset: { id: 'BTC' } },
              ],
            },
          })

          await wrapper.vm.loadOwnedAssets('SOME_ACCOUNT_ID')

          expect(Api.api.get)
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
