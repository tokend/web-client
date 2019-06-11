import ManageIssuanceMixin from './manage-issuance.mixin'

import { base } from '@tokend/js-sdk'

import { errors } from '@/js/errors'

import { mount, createLocalVue } from '@vue/test-utils'

import { api } from '@/api'

const localVue = createLocalVue()

const Component = {
  template: '<div></div>',
  props: ['requestId'],
  data: _ => ({
    form: {
      asset: {},
      amount: '0',
      receiver: '',
      reference: '',
    },
  }),
}

describe('Manage issuance mixin', () => {
  let sandbox
  let wrapper

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    wrapper = mount(Component, {
      mixins: [ManageIssuanceMixin],
      localVue,
    })
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('method', () => {
    describe('createIssuance', () => {
      it('calls proper methods to post issuance operation if receiver balance ID is not empty',
        async () => {
          wrapper.setData({
            form: {
              asset: { code: 'USD' },
              receiver: 'SOME_RECEIVER',
            },
          })

          sandbox.stub(wrapper.vm, 'getReceiverAccountId')
            .resolves('SOME_ACCOUNT_ID')
          sandbox.stub(wrapper.vm, 'getReceiverBalanceId')
            .resolves('SOME_BALANCE_ID')
          sandbox.stub(wrapper.vm, 'postIssuanceOperation').resolves()

          await wrapper.vm.createIssuance()

          expect(wrapper.vm.getReceiverAccountId)
            .to.have.been.calledOnceWithExactly('SOME_RECEIVER')
          expect(wrapper.vm.getReceiverBalanceId)
            .to.have.been.calledOnceWithExactly('SOME_ACCOUNT_ID', 'USD')
          expect(wrapper.vm.postIssuanceOperation)
            .to.have.been.calledOnceWithExactly('SOME_BALANCE_ID')
        }
      )

      it('throws BalanceNotFoundError if receiver balance ID is empty',
        async () => {
          sandbox.stub(wrapper.vm, 'getReceiverAccountId').resolves()
          sandbox.stub(wrapper.vm, 'getReceiverBalanceId').resolves()

          try {
            await wrapper.vm.createIssuance()
            throw new Error('The method should throw a specified error')
          } catch (e) {
            expect(e).to.be.instanceOf(errors.BalanceNotFoundError)
          }
        }
      )
    })

    describe('getReceiverBalanceId', () => {
      it('calls api.get method and returns balance by provided asset code',
        async () => {
          sandbox.stub(api, 'get').resolves({
            data: {
              balances: [
                { id: 'SOME_BALANCE_ID', asset: { id: 'USD' } },
                { id: 'OTHER_BALANCE_ID', asset: { id: 'BTC' } },
              ],
            },
          })

          const result = await wrapper.vm.getReceiverBalanceId(
            'SOME_ACCOUNT_ID', 'USD'
          )

          expect(api.get).to.have.been.calledOnceWithExactly(
            '/v3/accounts/SOME_ACCOUNT_ID',
            { include: ['balances.asset'] }
          )
          expect(result).to.equal('SOME_BALANCE_ID')
        }
      )

      it('returns empty string if specified balance was not found', async () => {
        sandbox.stub(api, 'get').resolves({
          data: {
            balances: [{ id: 'OTHER_BALANCE_ID', asset: { id: 'BTC' } }],
          },
        })

        const result = await wrapper.vm.getReceiverBalanceId(
          'SOME_ACCOUNT_ID', 'USD'
        )

        expect(result).to.equal('')
      })
    })

    describe('postIssuanceOperation', () => {
      it('builds and posts create issuance operation', async () => {
        wrapper.setData({
          form: {
            asset: { code: 'USD' },
            amount: 100,
            reference: 'SOME_REFERENCE',
            garbage: '100',
            humidity: '0.1',
          },
        })
        sandbox.stub(
          base.CreateIssuanceRequestBuilder, 'createIssuanceRequest'
        ).returns('ISSUANCE_OPERATION')
        sandbox.stub(api, 'postOperations').resolves()

        await wrapper.vm.postIssuanceOperation('SOME_BALANCE_ID')

        expect(base.CreateIssuanceRequestBuilder.createIssuanceRequest)
          .to.have.been.calledOnceWithExactly({
            asset: 'USD',
            amount: '100',
            receiver: 'SOME_BALANCE_ID',
            reference: 'SOME_REFERENCE',
            creatorDetails: {
              garbage: '100',
              humidity: '0.1',
            },
          })
        expect(api.postOperations)
          .to.have.been.calledOnceWithExactly('ISSUANCE_OPERATION')
      })
    })
  })
})
