import ManageAssetRequestMixin from './manage-asset-request.mixin'

import { Wallet, base } from '@tokend/js-sdk'
import { REQUEST_STATES } from '@/js/const/request-states.const'

import { mount, createLocalVue } from '@vue/test-utils'

import { api, useWallet } from '@/api'
import * as DocumentUploader from '@/js/helpers/upload-documents'

import { UpdateAssetRequest } from '../wrappers/update-asset-request'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

const localVue = createLocalVue()

const Component = {
  template: `<div></div>`,
  props: ['requestId'],
  data: _ => ({
    request: null,
    informationStepForm: {
      name: '',
      logo: null,
      policies: 0,
    },
    advancedStepForm: {
      terms: null,
    },
  }),
}

describe('Manage asset request mixin', () => {
  let sandbox
  let wrapper

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    wrapper = mount(Component, {
      mixins: [ManageAssetRequestMixin],
      localVue,
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('computed property', () => {
    describe('assetRequestOpts', () => {
      it('returns properly formatted properties', () => {
        wrapper.setData({
          request: {
            id: '10',
            code: 'USD',
          },
          informationStepForm: {
            name: 'American dollar',
            policies: 16,
          },
        })

        expect(wrapper.vm.assetRequestOpts.requestID).to.equal('10')
        expect(wrapper.vm.assetRequestOpts.code).to.equal('USD')

        expect(wrapper.vm.assetRequestOpts.creatorDetails.name)
          .to.equal('American dollar')
      })

      it('returns opts with default request ID if request property is null',
        () => {
          wrapper.setData({ request: null })

          expect(wrapper.vm.assetRequestOpts.requestID).to.equal('0')
        }
      )

      it('returns opts with empty documents if they are not set', () => {
        wrapper.setData({
          informationStepForm: { logo: null },
          advancedStepForm: { terms: null },
        })

        expect(wrapper.vm.assetRequestOpts.creatorDetails.logo)
          .to.deep.equal({
            mime_type: '',
            name: '',
            key: '',
          })
        expect(wrapper.vm.assetRequestOpts.creatorDetails.logo)
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
      const wallet = new Wallet(
        'test@mail.com',
        'SCPIPHBIMPBMGN65SDGCLMRN6XYGEV7WD44AIDO7HGEYJUNDKNKEGVYE',
        'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
        '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
      )

      api.useBaseURL('https://test.api.com')
      useWallet(wallet)
    })

    describe('getUpdateAssetRequestById', () => {
      it('returns UpdateAssetRequest record loaded using API.getWithSignature',
        async () => {
          sandbox.stub(api, 'getWithSignature').resolves({
            data: {},
          })

          const result = await wrapper.vm.getUpdateAssetRequestById('10', 'SOME_ACCOUNT_ID')

          expect(api.getWithSignature)
            .to.have.been.calledOnceWithExactly(
              '/v3/update_asset_requests/10',
              {
                filter: { requestor: 'SOME_ACCOUNT_ID' },
                include: ['request_details'],
              }
            )
          expect(result).to.be.instanceOf(UpdateAssetRequest)
        }
      )
    })

    describe('getLatestUpdateAssetRequest', () => {
      it('returns UpdateAssetRequest record loaded using API.getWithSignature',
        async () => {
          sandbox.stub(api, 'getWithSignature').resolves({
            data: [{}],
          })

          const result = await wrapper.vm.getLatestUpdateAssetRequest(1, 'SOME_ACCOUNT_ID')

          expect(api.getWithSignature)
            .to.have.been.calledOnceWithExactly(
              '/v3/update_asset_requests',
              {
                page: {
                  limit: 1,
                  order: 'desc',
                },
                filter: {
                  requestor: 'SOME_ACCOUNT_ID',
                  state: 1,
                },
                include: ['request_details'],
              }
            )
          expect(result).to.be.instanceOf(UpdateAssetRequest)
        }
      )

      it('returns null if API returned empty data array', async () => {
        sandbox.stub(api, 'getWithSignature').resolves({
          data: [],
        })

        const result = await wrapper.vm.getLatestUpdateAssetRequest(1, 'SOME_ACCOUNT_ID')

        expect(result).to.be.null
      })
    })

    describe('getUpdatableRequest', () => {
      it('returns getLatestUpdateAssetRequest response for pending or rejected requests state',
        async () => {
          const request = new UpdateAssetRequest({ id: '1' })
          sandbox.stub(wrapper.vm, 'getLatestUpdateAssetRequest')
            .resolves(request)

          const result = await wrapper.vm.getUpdatableRequest('SOME_ACCOUNT_ID')

          expect(wrapper.vm.getLatestUpdateAssetRequest)
            .to.have.been.calledTwice
          expect(wrapper.vm.getLatestUpdateAssetRequest)
            .to.have.been.calledWithExactly(REQUEST_STATES.pending, 'SOME_ACCOUNT_ID')
          expect(wrapper.vm.getLatestUpdateAssetRequest)
            .to.have.been.calledWithExactly(REQUEST_STATES.rejected, 'SOME_ACCOUNT_ID')
          expect(result).to.equal(request)
        }
      )
    })

    describe('submitUpdateAssetRequest', () => {
      it('uploads documents, creates and posts asset creation request',
        async () => {
          const logo = new DocumentContainer({ key: 'logo-key' })
          const terms = new DocumentContainer({ key: 'terms-key' })

          wrapper.setData({
            informationStepForm: { logo },
            advancedStepForm: { terms },
          })

          sandbox.stub(DocumentUploader, 'uploadDocuments').resolves()
          sandbox.stub(base.ManageAssetBuilder, 'assetUpdateRequest')
          sandbox.stub(api, 'postOperations').resolves()

          await wrapper.vm.submitUpdateAssetRequest()

          expect(DocumentUploader.uploadDocuments)
            .to.have.been.calledOnceWithExactly([logo, terms])
          expect(base.ManageAssetBuilder.assetUpdateRequest)
            .to.have.been.calledOnce
          expect(api.postOperations)
            .to.have.been.calledOnce
        }
      )
    })
  })
})
