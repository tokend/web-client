import ManageSaleDescriptionMixin from './manage-sale-description.mixin'

import { BLOB_TYPES } from '@tokend/js-sdk'

import { mount, createLocalVue } from '@vue/test-utils'

import { api } from '@/api'

const localVue = createLocalVue()

const Component = {
  template: `<div></div>`,
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
    describe('createSaleDescriptionBlob', () => {
      it('calls api.postWithSignature method with provided params and returns blob ID from response',
        async () => {
          sandbox.stub(api, 'postWithSignature').resolves({
            data: { id: 'BLOB_ID' },
          })

          const result = await wrapper.vm.createSaleDescriptionBlob(
            'Some description',
            'SOME_ACCOUNT_ID'
          )

          expect(api.postWithSignature)
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
      it('calls api.getWithSignature method with provided params and returns parsed response if loading succeded',
        async () => {
          sandbox.stub(api, 'getWithSignature').resolves({
            data: { value: '"Some value"' },
          })

          const result = await wrapper.vm.getSaleDescription('BLOB_ID', 'SOME_ACCOUNT_ID')

          expect(api.getWithSignature)
            .to.have.been.calledOnceWithExactly(
              '/accounts/SOME_ACCOUNT_ID/blobs/BLOB_ID'
            )
          expect(result).to.equal('Some value')
        }
      )

      it('returns empty string if loading failed',
        async () => {
          sandbox.stub(api, 'getWithSignature').rejects()

          const result = await wrapper.vm.getSaleDescription('BLOB_ID', 'SOME_ACCOUNT_ID')

          expect(result).to.equal('')
        }
      )
    })
  })
})
