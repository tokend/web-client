import GetReceiverAccountMixin from './get-receiver-account.mixin'

import { ApiCaller } from '@tokend/js-sdk'

import { errors } from '@/js/errors'

import { mount, createLocalVue } from '@vue/test-utils'

import * as Api from '../_api'

const localVue = createLocalVue()

const Component = {
  template: '<div></div>',
}

describe('Get receiver account mixin', () => {
  let sandbox
  let wrapper

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    wrapper = mount(Component, {
      mixins: [GetReceiverAccountMixin],
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

    describe('getReceiverAccountId', () => {
      it('calls getAccountIdByEmail method and returns its result if receiver is valid email',
        async () => {
          sandbox.stub(wrapper.vm, 'getAccountIdByEmail')
            .resolves('SOME_ACCOUNT_ID')

          const result = await wrapper.vm.getReceiverAccountId('foo@bar.com')

          expect(wrapper.vm.getAccountIdByEmail)
            .to.have.been.calledOnceWithExactly('foo@bar.com')
          expect(result).to.equal('SOME_ACCOUNT_ID')
        }
      )

      it('returns passed param if it is not valid email', async () => {
        const result = await wrapper.vm.getReceiverAccountId('RECEIVER_ID')

        expect(result).to.equal('RECEIVER_ID')
      })
    })

    describe('getAccountIdByEmail', () => {
      it('calls Api.get method and returns first found element if it exists',
        async () => {
          sandbox.stub(Api.api(), 'get').resolves({
            data: [
              { address: 'SOME_ACCOUNT_ID' },
              { address: 'OTHER_ACCOUNT_ID' },
            ],
          })

          const result = await wrapper.vm.getAccountIdByEmail('foo@bar.com')

          expect(Api.api().get).to.have.been.calledOnceWithExactly(
            '/identities',
            {
              filter: { email: 'foo@bar.com' },
              page: { limit: 1 },
            }
          )
          expect(result).to.equal('SOME_ACCOUNT_ID')
        }
      )

      it('throws an error if response data was empty', async () => {
        sandbox.stub(Api.api(), 'get').resolves({ data: [] })

        try {
          await wrapper.vm.getAccountIdByEmail('foo@bar.com')
          throw new Error('The method should throw a specified error')
        } catch (e) {
          expect(e).to.be.instanceOf(errors.UserDoesntExistError)
        }
      })
    })
  })
})
