import ManagePreIssuanceMixin from './manage-pre-issuance.mixin'

import { base } from '@tokend/js-sdk'

import { mount, createLocalVue } from '@vue/test-utils'

import { FileUtil } from '@/js/utils/file.util'

import { api } from '@/api'
import { AssetNotOwnedError, FileCorruptedError } from '../_errors'
import { Issuance } from '../wrappers/issuance'

const localVue = createLocalVue()

const Component = {
  template: '<div></div>',
  props: ['ownedAssets'],
}

describe('Manage pre-issuance mixin', () => {
  let sandbox
  let wrapper

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    wrapper = mount(Component, {
      mixins: [ManagePreIssuanceMixin],
      localVue,
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('method', () => {
    describe('createPreIssuanceRequest', () => {
      it('creates and posts pre-issuance operation if issuance asset is owned by user',
        async () => {
          wrapper.setProps({
            ownedAssets: [{ code: 'USD' }],
          })
          wrapper.setData({
            issuance: { asset: 'USD', xdr: 'SOME_XDR_VALUE' },
          })

          sandbox.stub(
            base.PreIssuanceRequestOpBuilder, 'createPreIssuanceRequestOp',
          ).returns('SOME_OPERATION')
          sandbox.stub(api, 'postOperations').resolves()

          await wrapper.vm.createPreIssuanceRequest()

          expect(base.PreIssuanceRequestOpBuilder.createPreIssuanceRequestOp)
            .to.have.been.calledOnceWithExactly({
              request: 'SOME_XDR_VALUE',
            })
          expect(api.postOperations)
            .to.have.been.calledOnceWithExactly('SOME_OPERATION')
        },
      )

      it('throws AssetNotOwnedError if issuance asset is not owned by user',
        async () => {
          wrapper.setProps({
            ownedAssets: [{ code: 'USD' }],
          })
          wrapper.setData({
            issuance: { asset: 'TKN' },
          })

          try {
            await wrapper.vm.createPreIssuanceRequest()
            throw new Error('The method should throw a specified error')
          } catch (e) {
            expect(e).to.be.instanceOf(AssetNotOwnedError)
          }
        },
      )
    })

    describe('extractPreIssuance', () => {
      it('extracts pre-issuance form the file and calls parsing method',
        async () => {
          sandbox.stub(FileUtil, 'getText')
            .resolves('{"issuances":[{"asset":"USD"},{"asset":"BTC"}]}')
          sandbox.stub(wrapper.vm, 'parsePreIssuance')

          await wrapper.vm.extractPreIssuance('SOME_FILE')

          expect(FileUtil.getText)
            .to.have.been.calledOnceWithExactly('SOME_FILE')
          expect(wrapper.vm.parsePreIssuance)
            .to.have.been.calledOnceWithExactly({ asset: 'USD' })
        },
      )

      it('throws FileCorruptedError if extracting failed', async () => {
        sandbox.stub(FileUtil, 'getText').rejects()

        try {
          await wrapper.vm.extractPreIssuance('SOME_FILE')
          throw new Error('The method should throw a specified error')
        } catch (e) {
          expect(e).to.be.instanceOf(FileCorruptedError)
        }
      })
    })

    describe('parsePreIssuance', () => {
      it('calls base methods with proper params and sets issuance property',
        () => {
          sandbox.stub(base.xdr.PreIssuanceRequest, 'fromXDR')
            .returns('SOME_XDR_VALUE')
          sandbox.stub(base.PreIssuanceRequest, 'dataFromXdr')
            .returns({ asset: 'USD', amount: '10.000000' })

          wrapper.vm.parsePreIssuance({
            preEmission: 'PRE_EMISSION',
            used: false,
          })

          expect(base.xdr.PreIssuanceRequest.fromXDR)
            .to.have.been.calledOnceWithExactly('PRE_EMISSION', 'hex')
          expect(base.PreIssuanceRequest.dataFromXdr)
            .to.have.been.calledOnceWithExactly('SOME_XDR_VALUE')

          expect(wrapper.vm.issuance).to.deep.equal(
            new Issuance({
              record: { asset: 'USD', amount: '10.000000' },
              xdr: 'SOME_XDR_VALUE',
              isUsed: false,
            }),
          )
        },
      )
    })
  })
})
