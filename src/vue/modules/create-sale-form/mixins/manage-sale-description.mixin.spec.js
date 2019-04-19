import ManageSaleDescriptionMixin from './manage-sale-description.mixin'

import { Wallet, BLOB_TYPES } from '@tokend/js-sdk'

import { mount, createLocalVue } from '@vue/test-utils'

import * as Api from '../_api'

const localVue = createLocalVue()

const Component = {
  template: `<div></div>`,
  props: ['wallet'],
}

describe('Manage sale description mixin', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Component, {
      mixins: [ManageSaleDescriptionMixin],
      localVue,
    })
  })

  describe('method', () => {
    beforeEach(() => {
      const wallet = new Wallet(
        'test@mail.com',
        'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
        'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
        '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
      )
      const config = {
        horizonURL: 'https://test.api.com',
      }

      Api.initApi(wallet, config)
    })

    describe('createSaleDescriptionBlob', () => {
      it('calls Api.postWithSignature method with provided params and returns blob ID from response',
        async () => {
          wrapper.setProps({ wallet: { accountId: 'SOME_ACCOUNT_ID' } })
          sinon.stub(Api.api(), 'postWithSignature').resolves({
            data: { id: 'BLOB_ID' },
          })

          const result = await wrapper.vm.createSaleDescriptionBlob(
            'Some description'
          )

          expect(Api.api().postWithSignature)
            .to.have.been.calledOnceWithExactly('/blobs', {
              data: {
                type: BLOB_TYPES.fundOverview,
                attributes: { value: JSON.stringify('Some description') },
                relationships: {
                  owner: { data: { id: 'SOME_ACCOUNT_ID' } },
                },
              },
            })
          expect(result).to.equal('BLOB_ID')

          Api.api().postWithSignature.restore()
        }
      )
    })

    describe('getSaleDescription', () => {
      it('calls Api.getWithSignature method with provided params and returns parsed response if loading succeded',
        async () => {
          wrapper.setProps({ wallet: { accountId: 'SOME_ACCOUNT_ID' } })
          sinon.stub(Api.api(), 'getWithSignature').resolves({
            data: { value: '"Some value"' },
          })

          const result = await wrapper.vm.getSaleDescription('BLOB_ID')

          expect(Api.api().getWithSignature)
            .to.have.been.calledOnceWithExactly(
              '/accounts/SOME_ACCOUNT_ID/blobs/BLOB_ID'
            )
          expect(result).to.equal('Some value')

          Api.api().getWithSignature.restore()
        }
      )

      it('returns empty string if loading failed',
        async () => {
          sinon.stub(Api.api(), 'getWithSignature').rejects()

          const result = await wrapper.vm.getSaleDescription('BLOB_ID')

          expect(result).to.equal('')

          Api.api().getWithSignature.restore()
        }
      )
    })
  })
})
