import Vuex from 'vuex'
import VueMaterial from 'vue-material'
import DepositMake from './Deposit.Make'
import { mount, createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(VueMaterial)

describe('Deposit.Make component', () => {
  const BtcDepositAddress = 'n2qdEUgcvoWCxuvRVRBmEvbTHmVEhLSgLx'
  const EthDepositAddress = '0x5b2616CE0f783Cd851Bc882433927dF7735BdFE7'
  let store
  let getters
  let DepositWrapper
  beforeEach(() => {
    getters = {
      userWalletTokens: () => [
        { code: 'BTC' },
        { code: 'ETH' }
      ],
      accountDepositAddresses: () => ({
        BTC: BtcDepositAddress,
        ETH: EthDepositAddress
      })
    }
    store = new Vuex.Store({
      state: {},
      getters
    })
    DepositWrapper = mount(DepositMake, { store, localVue })
  })

  it('should have proper computed property set when BTC is selected', () => {
    DepositWrapper.setData({ form: { tokenCode: 'BTC' } })
    expect(DepositWrapper.vm.address).to.equal(BtcDepositAddress)
  })

  it('should have proper computed property set when BTC is selected', () => {
    DepositWrapper.setData({ form: { tokenCode: 'ETH' } })
    expect(DepositWrapper.vm.address).to.equal(EthDepositAddress)
  })

  it ('should have proper tokenCodes property value', () => {
    expect(DepositWrapper.vm.tokenCodes).to.deep.equal([ 'BTC', 'ETH' ])
  })
})
