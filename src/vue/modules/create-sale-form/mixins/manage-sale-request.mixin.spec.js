import ManageSaleRequestMixin from './manage-sale-request.mixin'

import { ApiCaller, base } from '@tokend/js-sdk'

import { mount, createLocalVue } from '@vue/test-utils'

import * as Api from '../_api'

import { CreateSaleRequest } from '../wrappers/create-sale-request'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

const localVue = createLocalVue()

const Component = {
  template: `<div></div>`,
  props: ['wallet', 'requestId'],
  data: _ => ({
    informationStepForm: {
      name: '',
      baseAsset: {},
      startTime: '',
      endTime: '',
      softCap: '',
      hardCap: '',
      assetsToSell: '',
      quoteAssets: [],
    },
    shortBlurbStepForm: {
      saleLogo: null,
      shortDescription: '',
    },
    fullDescriptionStepForm: {
      youtubeId: '',
    },
  }),
}

describe('Manage sale request mixin', () => {
  let sandbox
  let wrapper

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    wrapper = mount(Component, {
      mixins: [ManageSaleRequestMixin],
      localVue,
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('computed property', () => {
    describe('saleRequestOpts', () => {
      it('returns properly formatted properties', () => {
        wrapper.setProps({
          requestId: '10',
        })
        wrapper.setData({
          informationStepForm: {
            name: 'My sale',
            baseAsset: { code: 'TKN' },
            softCap: '100.000000',
            hardCap: '200.000000',
            assetsToSell: '10.000000',
            quoteAssets: ['BTC', 'USD'],
          },
          shortBlurbStepForm: { shortDescription: 'Some description' },
          fullDescriptionStepForm: { youtubeId: 'youtube-video-id' },
          saleDescriptionBlobId: 'BLOB_ID',
        })

        expect(wrapper.vm.saleRequestOpts.requestID).to.equal('10')
        expect(wrapper.vm.saleRequestOpts.softCap).to.equal('100.000000')
        expect(wrapper.vm.saleRequestOpts.hardCap).to.equal('200.000000')

        expect(wrapper.vm.saleRequestOpts.baseAsset).to.equal('TKN')
        expect(wrapper.vm.saleRequestOpts.requiredBaseAssetForHardCap)
          .to.equal('10.000000')
        expect(wrapper.vm.saleRequestOpts.quoteAssets)
          .to.deep.equal([
            { asset: 'BTC', price: '1' },
            { asset: 'USD', price: '1' },
          ])

        expect(wrapper.vm.saleRequestOpts.creatorDetails.name)
          .to.equal('My sale')
        expect(wrapper.vm.saleRequestOpts.creatorDetails.short_description)
          .to.equal('Some description')
        expect(wrapper.vm.saleRequestOpts.creatorDetails.description)
          .to.equal('BLOB_ID')
        expect(wrapper.vm.saleRequestOpts.creatorDetails.youtube_video_id)
          .to.equal('youtube-video-id')
      })

      it('returns opts with default request ID if requestId prop is empty',
        () => {
          wrapper.setProps({
            requestId: '',
          })

          expect(wrapper.vm.saleRequestOpts.requestID).to.equal('0')
        }
      )

      it('returns opts with empty documents if they are not set', () => {
        wrapper.setData({
          shortBlurbStepForm: { saleLogo: null },
        })

        expect(wrapper.vm.saleRequestOpts.creatorDetails.logo)
          .to.deep.equal({
            mime_type: '',
            name: '',
            key: '',
          })
      })
    })
  })

  describe('method', () => {
    beforeEach(() => {
      sandbox.stub(Api, 'api').returns(ApiCaller.getInstance())
    })

    describe('getCreateSaleRequestById', () => {
      it('calls Api.getWithSignature method with provided params and returns an instance of CreateSaleRequest record',
        async () => {
          wrapper.setProps({
            wallet: { accountId: 'SOME_ACCOUNT_ID' },
          })
          sandbox.stub(Api.api(), 'getWithSignature').resolves({
            data: {},
          })

          const result = await wrapper.vm.getCreateSaleRequestById('10')

          expect(Api.api().getWithSignature)
            .to.have.been.calledOnceWithExactly(
              '/v3/create_sale_requests/10',
              {
                filter: { requestor: 'SOME_ACCOUNT_ID' },
                include: ['request_details', 'request_details.default_quote_asset'],
              }
            )
          expect(result).to.be.instanceOf(CreateSaleRequest)
        }
      )
    })

    describe('submitCreateSaleRequest', () => {
      it('uploads documents, creates blob, and posts asset creation request',
        async () => {
          const saleLogo = new DocumentContainer({ key: 'logo-key' })

          wrapper.setData({
            shortBlurbStepForm: { saleLogo },
            fullDescriptionStepForm: { description: 'Sale description' },
          })

          sandbox.stub(wrapper.vm, 'uploadDocuments').resolves()
          sandbox.stub(wrapper.vm, 'createSaleDescriptionBlob')
            .resolves('BLOB_ID')
          sandbox.stub(base.SaleRequestBuilder, 'createSaleCreationRequest')
          sandbox.stub(Api.api(), 'postOperations').resolves()

          await wrapper.vm.submitCreateSaleRequest()

          expect(wrapper.vm.uploadDocuments)
            .to.have.been.calledOnceWithExactly([saleLogo])
          expect(wrapper.vm.createSaleDescriptionBlob)
            .to.have.been.calledOnceWithExactly('Sale description')
          expect(wrapper.vm.saleDescriptionBlobId).to.equal('BLOB_ID')

          expect(base.SaleRequestBuilder.createSaleCreationRequest)
            .to.have.been.calledOnce
          expect(Api.api().postOperations)
            .to.have.been.calledOnce
        }
      )
    })
  })
})
