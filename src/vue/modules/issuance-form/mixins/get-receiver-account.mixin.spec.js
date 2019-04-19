import GetReceiverAccountMixin from './get-receiver-account.mixin'

import { Wallet } from '@tokend/js-sdk'

import { errors } from '@/js/errors'

import { mount, createLocalVue } from '@vue/test-utils'

import * as Api from '../_api'

const localVue = createLocalVue()

const Component = {
  template: '<div></div>',
}

describe('Get receiver account mixin', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Component, {
      mixins: [GetReceiverAccountMixin],
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

    describe('getReceiverAccountId', () => {
      it('calls getAccountIdByEmail method and returns its result if receiver is valid email',
        async () => {
          sinon.stub(wrapper.vm, 'getAccountIdByEmail')
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
          sinon.stub(Api.api(), 'get').resolves({
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

          Api.api().get.restore()
        }
      )

      it('throws an error if response data was empty', async () => {
        sinon.stub(Api.api(), 'get').resolves({ data: [] })

        try {
          await wrapper.vm.getAccountIdByEmail('foo@bar.com')
          throw new Error('The method should throw a specified error')
        } catch (e) {
          expect(e).to.be.instanceOf(errors.UserDoesntExistError)
        }

        Api.api().get.restore()
      })
    })
  })
})
