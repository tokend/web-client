import ManageSaleDescriptionMixin from './manage-sale-description.mixin'

import { ApiCaller, BLOB_TYPES } from '@tokend/js-sdk'

import { mount, createLocalVue } from '@vue/test-utils'

import * as Api from '../_api'

const localVue = createLocalVue()

const Component = {
  template: `<div></div>`,
  props: ['wallet'],
}

describe('Manage sale description mixin', () => {
  let sandbox
  let wrapper

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    wrapper = mount(Component, {
      mixins: [ManageSaleDescriptionMixin],
      localVue,
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('method', () => {
    beforeEach(() => {
      sandbox.stub(Api, 'api').returns(ApiCaller.getInstance())
    })

    describe('createSaleDescriptionBlob', () => {
      it('calls Api.postWithSignature method with provided params and returns blob ID from response',
        async () => {
          wrapper.setProps({ wallet: { accountId: 'SOME_ACCOUNT_ID' } })
          sandbox.stub(Api.api(), 'postWithSignature').resolves({
            data: { id: 'BLOB_ID' },
          })

          const result = await wrapper.vm.createSaleDescriptionBlob(
            'Some description'
          )

          expect(Api.api().postWithSignature)
            .to.have.been.calledOnceWithExactly('/blobs', {
              data: {
                type: BLOB_TYPES.saleOverview,
                attributes: { value: JSON.stringify('Some description') },
                relationships: {
                  owner: { data: { id: 'SOME_ACCOUNT_ID' } },
                },
              },
            })
          expect(result).to.equal('BLOB_ID')
        }
      )
    })

    describe('getSaleDescription', () => {
      it('calls Api.getWithSignature method with provided params and returns parsed response if loading succeded',
        async () => {
          wrapper.setProps({ wallet: { accountId: 'SOME_ACCOUNT_ID' } })
          sandbox.stub(Api.api(), 'getWithSignature').resolves({
            data: { value: '"Some value"' },
          })

          const result = await wrapper.vm.getSaleDescription('BLOB_ID')

          expect(Api.api().getWithSignature)
            .to.have.been.calledOnceWithExactly(
              '/accounts/SOME_ACCOUNT_ID/blobs/BLOB_ID'
            )
          expect(result).to.equal('Some value')
        }
      )

      it('returns empty string if loading failed',
        async () => {
          sandbox.stub(Api.api(), 'getWithSignature').rejects()

          const result = await wrapper.vm.getSaleDescription('BLOB_ID')

          expect(result).to.equal('')
        }
      )
    })
  })
})
