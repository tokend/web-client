import ManageAssetRequestMixin from './manage-asset-request.mixin'

import { Wallet, base } from '@tokend/js-sdk'

import { mount, createLocalVue } from '@vue/test-utils'

import { api, useWallet } from '@/api'
import * as DocumentUploader from '@/js/helpers/upload-documents'

import { CreateAssetRequest } from '../wrappers/create-asset-request'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

import config from '@/config'

const localVue = createLocalVue()

const Component = {
  template: '<div></div>',
  props: ['requestId'],
  data: _ => ({
    collectedCreateAssetAttributes: {
      name: '',
      code: '',
      maxIssuanceAmount: '',
      logo: null,
      policies: 0,
      assetType: '',
      isPreIssuanceEnabled: true,
      preIssuanceAssetSigner: '',
      initialPreissuedAmount: '',
      terms: null,
      isMaxAmountRestricted: false,
      isStellarIntegrationEnabled: false,
      isUsageRestricted: false,
    },
  }),
}

// TODO: stellar attributes

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
            collectedCreateAssetAttributes: { logo, terms },
          })

          sandbox.stub(DocumentUploader, 'uploadDocuments').resolves()
          sandbox.stub(wrapper.vm, '$buildAssetCreationRequestOperation')
            .withArgs(42).returns('THE_OPERATION')
          sandbox.stub(api, 'postOperations').resolves()

          await wrapper.vm.submitCreateAssetRequest(42)

          expect(DocumentUploader.uploadDocuments)
            .to.have.been.calledOnceWithExactly([logo, terms])
          expect(wrapper.vm.$buildAssetCreationRequestOperation)
            .to.have.been.calledOnce
          expect(api.postOperations)
            .to.have.been.calledOnceWithExactly('THE_OPERATION')
        }
      )
    })

    describe('$buildAssetCreationRequestOperation()', () => {
      it('builds operation with content of `collectedCreateAssetAttributes`', () => {
        wrapper.setData({
          collectedCreateAssetAttributes: {
            logo: 'LOGO_DOCUMENT',
            terms: 'TERMS_DOCUMENT',
            code: 'TOKEN',
            name: 'Test token',
            policies: 12345,
          },
        })

        sandbox.stub(wrapper.vm, '$getAssetTypeStringed')
          .returns('ASSET_TYPE_STRINGED')
        sandbox.stub(wrapper.vm, '$getMaxIssuanceAmount')
          .returns('MAX_ISSUANCE_AMOUNT')
        sandbox.stub(wrapper.vm, '$getPreIssuanceAssetSigner')
          .returns('PRE_ISSUANCE_ASSET_SIGNER')
        sandbox.stub(wrapper.vm, '$getInitialPreIssuedAmount')
          .returns('INITIAL_PRE_ISSUED_AMOUNT')
        sandbox.stub(wrapper.vm, '$getStellarIntegrationAttributes')
          .returns('STELLAR_INTEGRATION_ATTRIBUTES')
        sandbox.stub(wrapper.vm, '$getDocumentDetailsOrEmptyDocument')
          .withArgs('LOGO_DOCUMENT').returns('LOGO_DOCUMENT_DETAILS')
          .withArgs('TERMS_DOCUMENT').returns('TERMS_DOCUMENT_DETAILS')
        sandbox.stub(base.ManageAssetBuilder, 'assetCreationRequest')

        wrapper.vm.$buildAssetCreationRequestOperation()

        expect(base.ManageAssetBuilder.assetCreationRequest).to.be
          .calledOnceWithExactly({
            requestID: '0',
            trailingDigitsCount: config.DECIMAL_POINTS,
            code: 'TOKEN',
            policies: 12345,
            assetType: 'ASSET_TYPE_STRINGED',
            maxIssuanceAmount: 'MAX_ISSUANCE_AMOUNT',
            preissuedAssetSigner: 'PRE_ISSUANCE_ASSET_SIGNER',
            initialPreissuedAmount: 'INITIAL_PRE_ISSUED_AMOUNT',
            creatorDetails: {
              name: 'Test token',
              logo: 'LOGO_DOCUMENT_DETAILS',
              terms: 'TERMS_DOCUMENT_DETAILS',
              stellar: 'STELLAR_INTEGRATION_ATTRIBUTES',
            },
          })
      })
    })

    describe('$getAssetTypeStringed()', () => {
      it('when asset usage restricted returns stringified value of `collectedCreateAssetAttributes.assetType`',
        () => {
          wrapper.setData({
            collectedCreateAssetAttributes: {
              isUsageRestricted: true,
              assetType: 74,
            },
          })
          expect(wrapper.vm.$getAssetTypeStringed()).to.equal('74')
        }
      )

      // TODO: add test case: when asset usage unrestricted returns stringified
      // value of store.getters[vuexTypes.kvAssetTypeDefault]
    })

    describe('$getMaxIssuanceAmount()', () => {
      it('when max asset amount restricted returns value of `collectedCreateAssetAttributes.maxIssuanceAmount`',
        () => {
          wrapper.setData({
            collectedCreateAssetAttributes: {
              isMaxAmountRestricted: true,
              maxIssuanceAmount: '808080.000000',
            },
          })
          expect(wrapper.vm.$getMaxIssuanceAmount()).to.equal('808080.000000')
        }
      )

      it('when pre-issuance disabled returns value of MAX_AMOUNT of config',
        () => {
          wrapper.setData({
            collectedCreateAssetAttributes: {
              isMaxAmountRestricted: false,
            },
          })
          expect(wrapper.vm.$getMaxIssuanceAmount()).to
            .equal(config.MAX_AMOUNT)
        }
      )
    })

    describe('$getPreIssuanceAssetSigner()', () => {
      it('when pre-issuance enabled returns value of `collectedCreateAssetAttributes.preIssuanceAssetSigner`',
        () => {
          wrapper.setData({
            collectedCreateAssetAttributes: {
              isPreIssuanceEnabled: true,
              preIssuanceAssetSigner: 'SIGNER_ID',
            },
          })
          expect(wrapper.vm.$getPreIssuanceAssetSigner()).to.equal('SIGNER_ID')
        }
      )

      it('when pre-issuance disabled returns value of NULL_ASSET_SIGNER of config',
        () => {
          wrapper.setData({
            collectedCreateAssetAttributes: {
              isPreIssuanceEnabled: false,
            },
          })
          expect(wrapper.vm.$getPreIssuanceAssetSigner()).to
            .equal(config.NULL_ASSET_SIGNER)
        }
      )
    })

    describe('$getInitialPreIssuedAmount()', () => {
      it('when pre-issuance enabled returns value of `collectedCreateAssetAttributes.maxIssuanceAmount`',
        () => {
          wrapper.setData({
            collectedCreateAssetAttributes: {
              isPreIssuanceEnabled: true,
              initialPreissuedAmount: '42.000000',
            },
          })
          expect(wrapper.vm.$getInitialPreIssuedAmount()).to.equal('42.000000')
        }
      )

      it('when pre-issuance disabled returns value result of `$getMaxIssuanceAmount()`',
        () => {
          sandbox.stub(wrapper.vm, '$getMaxIssuanceAmount').returns('84.000000')

          wrapper.setData({
            collectedCreateAssetAttributes: {
              isPreIssuanceEnabled: false,
            },
          })

          expect(wrapper.vm.$getInitialPreIssuedAmount()).to.equal('84.000000')
        }
      )
    })

    describe('$getStellarIntegrationAttributes()', () => {
      it('when stellar integration enabled returns collected integration attributes',
        () => {
          wrapper.setData({
            collectedCreateAssetAttributes: {
              isStellarIntegrationEnabled: true,
              stellar: {
                withdraw: true,
                deposit: false,
                assetType: 'alphanum4',
                assetCode: 'LTC',
              },
            },
          })

          expect(wrapper.vm.$getStellarIntegrationAttributes()).to.deep.equal({
            withdraw: true,
            deposit: false,
            asset_type: 'alphanum4',
            asset_code: 'LTC',
          })
        }
      )

      it('when stellar integration disabled returns an empty object',
        () => {
          wrapper.setData({
            collectedCreateAssetAttributes: {
              isStellarIntegrationEnabled: false,
            },
          })

          expect(wrapper.vm.$getStellarIntegrationAttributes()).to.deep
            .equal({})
        }
      )
    })

    describe('$getDocumentDetailsOrEmptyDocument()', () => {
      it('when instance of DocumentContainer provided returns result of `doc#getDetailsForSave()`', () => {
        const document = new DocumentContainer({ key: 'some-key' })
        sandbox.stub(document, 'getDetailsForSave')
          .returns(4242) // we do not care of what returned actually

        expect(wrapper.vm.$getDocumentDetailsOrEmptyDocument(document)).to
          .equal(4242)
      })

      it('when not an instance of DocumentContainer provided returns result of `DocumentContainer#getEmptyDetailsForSave()`', () => {
        sandbox.stub(DocumentContainer, 'getEmptyDetailsForSave')
          .returns(848484) // we do not care of what returned actually

        expect(wrapper.vm.$getDocumentDetailsOrEmptyDocument()).to.deep
          .equal(848484)
      })
    })
  })
})
