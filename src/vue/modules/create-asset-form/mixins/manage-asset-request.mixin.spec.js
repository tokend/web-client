import ManageAssetRequestMixin from './manage-asset-request.mixin'
import UploadDocumentsMixin from './upload-documents.mixin'

import { Wallet, base } from '@tokend/js-sdk'

import { mount, createLocalVue } from '@vue/test-utils'

import { api, useWallet } from '@/api'
import * as Config from '../_config'

import { CreateAssetRequest } from '../wrappers/create-asset-request'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

const localVue = createLocalVue()

const Component = {
  template: '<div></div>',
  props: ['requestId'],
  data: _ => ({
    informationStepForm: {
      name: '',
      code: '',
      maxIssuanceAmount: '',
      logo: null,
      policies: 0,
      assetType: '',
    },
    advancedStepForm: {
      isPreissuanceDisabled: false,
      preIssuanceAssetSigner: '',
      initialPreissuedAmount: '',
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
      mixins: [ManageAssetRequestMixin, UploadDocumentsMixin],
      localVue,
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('computed property', () => {
    describe('preIssuanceAssetSigner', () => {
      it('returns null asset signer ID, if pre-issuance is disabled, or preissued asset signer property otherwise',
        () => {
          sandbox.stub(Config, 'config').returns({
            NULL_ASSET_SIGNER: 'NULL_ASSET_SIGNER',
          })
          wrapper.setData({
            advancedStepForm: { isPreissuanceDisabled: true },
          })
          expect(wrapper.vm.preIssuanceAssetSigner)
            .to.equal('NULL_ASSET_SIGNER')

          wrapper.setData({
            advancedStepForm: {
              isPreissuanceDisabled: false,
              preIssuanceAssetSigner: 'SIGNER_ID',
            },
          })
          expect(wrapper.vm.preIssuanceAssetSigner).to.equal('SIGNER_ID')
        }
      )
    })

    describe('initialPreissuedAmount', () => {
      it('returns max issuance amount property, if pre-issuance is disabled, or initial preissued amount property otherwise',
        () => {
          wrapper.setData({
            informationStepForm: { maxIssuanceAmount: '1000.000000' },
            advancedStepForm: { isPreissuanceDisabled: true },
          })
          expect(wrapper.vm.initialPreissuedAmount).to.equal('1000.000000')

          wrapper.setData({
            advancedStepForm: {
              isPreissuanceDisabled: false,
              initialPreissuedAmount: '500.000000',
            },
          })
          expect(wrapper.vm.initialPreissuedAmount).to.equal('500.000000')
        }
      )
    })

    describe('assetRequestOpts', () => {
      it('returns properly formatted properties', () => {
        wrapper.setProps({
          requestId: '10',
        })
        wrapper.setData({
          informationStepForm: {
            name: 'American dollar',
            code: 'USD',
            maxIssuanceAmount: '1000.000000',
            policies: 16,
            assetType: { value: 1 },
          },
          advancedStepForm: {
            isPreissuanceDisabled: false,
            preIssuanceAssetSigner: 'SIGNER_ID',
            initialPreissuedAmount: '500.000000',
          },
        })

        expect(wrapper.vm.assetRequestOpts.requestID).to.equal('10')
        expect(wrapper.vm.assetRequestOpts.code).to.equal('USD')
        expect(wrapper.vm.assetRequestOpts.assetType).to.equal('1')

        expect(wrapper.vm.assetRequestOpts.preissuedAssetSigner)
          .to.equal('SIGNER_ID')
        expect(wrapper.vm.assetRequestOpts.initialPreissuedAmount)
          .to.equal('500.000000')
        expect(wrapper.vm.assetRequestOpts.maxIssuanceAmount)
          .to.equal('1000.000000')

        expect(wrapper.vm.assetRequestOpts.creatorDetails.name)
          .to.equal('American dollar')
      })

      it('returns opts with default request ID if requestId prop is empty',
        () => {
          wrapper.setProps({
            requestId: '',
          })

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

    describe('getCreateAssetRequestById', () => {
      it('calls api.getWithSignature method with provided params and returns an instance of CreateAssetRequest record',
        async () => {
          sandbox.stub(api, 'getWithSignature').resolves({
            data: {},
          })

          const result = await wrapper.vm.getCreateAssetRequestById('10', 'SOME_ACCOUNT_ID')

          expect(api.getWithSignature)
            .to.have.been.calledOnceWithExactly(
              '/v3/create_asset_requests/10',
              {
                filter: { requestor: 'SOME_ACCOUNT_ID' },
                include: ['request_details'],
              }
            )
          expect(result).to.be.instanceOf(CreateAssetRequest)
        }
      )
    })

    describe('submitCreateAssetRequest', () => {
      it('uploads documents, creates and posts asset creation request',
        async () => {
          const logo = new DocumentContainer({ key: 'logo-key' })
          const terms = new DocumentContainer({ key: 'terms-key' })

          wrapper.setData({
            informationStepForm: { logo },
            advancedStepForm: { terms },
          })

          sandbox.stub(wrapper.vm, 'uploadDocuments').resolves()
          sandbox.stub(base.ManageAssetBuilder, 'assetCreationRequest')
          sandbox.stub(api, 'postOperations').resolves()

          await wrapper.vm.submitCreateAssetRequest('SOME_ACCOUNT_ID')

          expect(wrapper.vm.uploadDocuments)
            .to.have.been.calledOnceWithExactly([
              logo,
              terms,
            ], 'SOME_ACCOUNT_ID')
          expect(base.ManageAssetBuilder.assetCreationRequest)
            .to.have.been.calledOnce
          expect(api.postOperations)
            .to.have.been.calledOnce
        }
      )
    })
  })
})
