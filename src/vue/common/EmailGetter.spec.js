import EmailGetter from './EmailGetter'

import { createLocalVue, shallowMount } from '@vue/test-utils'
import { globalize } from '@/vue/filters/globalize'

import { MockHelper, MockWrapper } from '@/test'

const localVue = createLocalVue()
localVue.filter('globalize', globalize)

describe('EmailGetter component unit test', () => {
  let mockHelper

  let balancesResource
  let usersResource

  let wrapper

  beforeEach(() => {
    mockHelper = new MockHelper()
    balancesResource = mockHelper.getHorizonResourcePrototype('balances')
    usersResource = mockHelper.getApiResourcePrototype('users')

    sinon.stub(EmailGetter, 'created').resolves()
    wrapper = shallowMount(EmailGetter, {
      localVue
    })
  })

  afterEach(() => {
    sinon.restore()
  })

  it('loadEmail() calls the api.users.get() with the correct params', async () => {
    wrapper.setProps({ accountId: mockHelper.getMockWallet().accountId })
    const spy = sinon.stub(usersResource, 'get').resolves({ data: {} })

    await wrapper.vm.loadEmail()

    expect(spy
      .withArgs(mockHelper.getMockWallet().accountId)
      .calledOnce
    ).to.be.true
  })

  it('loadEmail() method is called inside created hook', async () => {
    sinon.restore()
    const spy = sinon.stub(EmailGetter.methods, 'loadEmail')

    await shallowMount(EmailGetter, { localVue })

    expect(spy.calledOnce).to.be.true
  })

  it('loadEmail() calls the horizon.balances.getAccount() if there is only balanceId in props', async () => {
    const sampleBalanceData = {
      balanceId: 'BCQOBAIMVNNH7RHZTD4OVSRUX2W575VUK4RUYELRHDPXSXJ5TMS2BHAV',
      accountId: mockHelper.getMockWallet().accountId
    }
    wrapper.setProps({ balanceId: sampleBalanceData.balanceId })
    const spy = sinon.stub(balancesResource, 'getAccount')
      .resolves(MockWrapper.makeHorizonResponse(sampleBalanceData))
    sinon.stub(usersResource, 'get').resolves({ data: {} })

    await wrapper.vm.loadEmail()

    expect(spy
      .withArgs(sampleBalanceData.balanceId)
      .calledOnce
    ).to.be.true
  })
})
