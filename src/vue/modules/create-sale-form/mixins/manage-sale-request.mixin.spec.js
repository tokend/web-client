import ManageSaleRequestMixin from './manage-sale-request.mixin'

import { base, Document } from '@tokend/js-sdk'

import { mount, createLocalVue } from '@vue/test-utils'

import { api } from '@/api'

import { CreateSaleRequest } from '../wrappers/create-sale-request'
import Vuex from 'vuex'

const localVue = createLocalVue()

const Component = {
  template: `<div></div>`,
  props: ['requestId'],
  data: _ => ({
    informationStepForm: {
      name: '',
      type: '',
      baseAsset: {},
      capAsset: {},
      startTime: '',
      endTime: '',
      softCap: '',
      hardCap: '',
      assetsToSell: '',
      quoteAssets: [],
      isWhitelisted: false,
    },
    shortBlurbStepForm: {
      saleLogo: null,
      shortDescription: '',
    },
    fullDescriptionStepForm: {
      youtubeId: '',
    },
    assets: [],
  }),
}

describe('Manage sale request mixin', () => {
  let sandbox
  let wrapper
  let store

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    store = new Vuex.Store({
      modules: {
        account: {
          getters: {
            accountId: () => ('SOME_ACCOUNT_ID'),
          },
        },
      },
    })

    wrapper = mount(Component, {
      store,
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
            capAsset: { code: 'USD' },
            softCap: '100.000000',
            hardCap: '200.000000',
            assetsToSell: '10.000000',
            quoteAssets: ['BTC', 'ETH'],
            isWhitelisted: true,
          },
          shortBlurbStepForm: { shortDescription: 'Some description' },
          fullDescriptionStepForm: { youtubeId: 'youtube-video-id' },
          saleDescriptionBlobId: 'BLOB_ID',
        })

        expect(wrapper.vm.saleRequestOpts.requestID).to.equal('10')
        expect(wrapper.vm.saleRequestOpts.softCap).to.equal('100.000000')
        expect(wrapper.vm.saleRequestOpts.hardCap).to.equal('200.000000')

        expect(wrapper.vm.saleRequestOpts.baseAsset).to.equal('TKN')
        expect(wrapper.vm.saleRequestOpts.defaultQuoteAsset).to.equal('USD')
        expect(wrapper.vm.saleRequestOpts.requiredBaseAssetForHardCap)
          .to.equal('10.000000')
        expect(wrapper.vm.saleRequestOpts.quoteAssets)
          .to.deep.equal([
            { asset: 'BTC', price: '1' },
            { asset: 'ETH', price: '1' },
          ])

        expect(wrapper.vm.saleRequestOpts.creatorDetails.name)
          .to.equal('My sale')
        expect(wrapper.vm.saleRequestOpts.creatorDetails.short_description)
          .to.equal('Some description')
        expect(wrapper.vm.saleRequestOpts.creatorDetails.description)
          .to.equal('BLOB_ID')
        expect(wrapper.vm.saleRequestOpts.creatorDetails.youtube_video_id)
          .to.equal('youtube-video-id')

        expect(wrapper.vm.saleRequestOpts.saleRules)
          .to.deep.equal([{ forbids: true }])
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
    describe('getCreateSaleRequestById', () => {
      it('calls api.getWithSignature method with provided params and returns an instance of CreateSaleRequest record',
        async () => {
          sandbox.stub(api, 'getWithSignature').resolves({
            data: {},
          })

          const result = await wrapper.vm.getCreateSaleRequestById('10', 'SOME_ACCOUNT_ID')

          expect(api.getWithSignature)
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
      it('calls proper methods with passed params',
        async () => {
          const saleLogo = new Document({ key: 'logo-key' })

          wrapper.setData({
            assets: [{ code: 'BTC' }, { code: 'ETH' }],
            informationStepForm: { quoteAssets: ['USD'] },
            shortBlurbStepForm: { saleLogo },
            fullDescriptionStepForm: { description: 'Sale description' },
          })

          sandbox.stub(wrapper.vm, 'createBalancesIfNotExist').resolves()
          sandbox.stub(wrapper.vm, 'loadAssetsPairsByQuote').resolves([])

          sandbox.stub(wrapper.vm, 'createSaleDescriptionBlob')
            .resolves('BLOB_ID')
          sandbox.stub(base.SaleRequestBuilder, 'createSaleCreationRequest')
          sandbox.stub(api, 'postOperations').resolves()

          await wrapper.vm.submitCreateSaleRequest('SOME_ACCOUNT_ID')

          expect(wrapper.vm.createBalancesIfNotExist)
            .to.have.been.calledOnceWithExactly({
              balanceAssets: ['BTC', 'ETH'],
              quoteAssets: ['USD'],
              accountId: 'SOME_ACCOUNT_ID',
            })

          expect(wrapper.vm.createSaleDescriptionBlob)
            .to.have.been.calledOnceWithExactly(
              'Sale description',
              'SOME_ACCOUNT_ID'
            )
          expect(wrapper.vm.saleDescriptionBlobId).to.equal('BLOB_ID')

          expect(base.SaleRequestBuilder.createSaleCreationRequest)
            .to.have.been.calledOnce
          expect(api.postOperations)
            .to.have.been.calledOnce
        }
      )
    })
  })
})
