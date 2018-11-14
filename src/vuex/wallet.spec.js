import { MockHelper } from '../test'

import { mutations, actions, getters } from './wallet.module'
import { vuexTypes } from './types'

import { Wallet, base } from '@tokend/js-sdk'

describe('wallet.module', () => {
  const mockSeed = 'SAG3O2PBA3KAAUP3E3WRHRI5NM5GFKQIOXBNHP7B4VMWYYOAN6OFAHA4'
  // PK = GDYMQR4ZNISMAVBTEKNKD63JSWRR4D3FHNBZSW36MDM3E3J32QUOQLU2

  const mockWallet = new Wallet(
    'alice@mail.com',
    mockSeed,
    'GA7QET54X3WDJPMGRKTE32WKM4NRLKKKHHI74NXNMNTQR3VONA3XGIBP',
    '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c'
  )

  beforeEach(() => {
    sinon.restore()
  })

  describe('mutations', () => {
    it('SET_WALLET should properly modify state', () => {
      const wallet = { id: 'someWalletID', walletData: 'someWalletData' }
      const state = { wallet: {} }

      mutations.SET_WALLET(state, wallet)

      expect(state).to.deep.equal({ wallet })
    })
  })

  describe('actions', () => {
    let mockHelper
    let store

    beforeEach(() => {
      mockHelper = new MockHelper()
      store = {
        state: {},
        getters: {},
        commit: sinon.stub(),
        dispatch: sinon.stub()
      }
    })

    it('LOAD_WALLET commits proper set of mutations', async () => {
      mockHelper.mockMethod('api', 'wallets', 'get', mockWallet)

      const credentials = { email: 'bob@mail.com', password: 'qweqweqwe' }
      const expectedMutations = { [vuexTypes.SET_WALLET]: mockWallet }

      await actions.LOAD_WALLET(store, credentials)

      expect(store.commit.args).to.deep.equal(Object.entries(expectedMutations))
    })
  })

  describe('getters', () => {
    it('walletId', () => {
      const id = '0a0dc11el4lkf845d828c45dbd68d5d1196c3a182b08cd22f05c51fcf15w153c'
      const state = {
        wallet: {
          id
        }
      }

      expect(getters.walletId(state)).to.equal(id)
    })

    it('walletEmail', () => {
      const email = 'foo@bar.com'
      const state = {
        wallet: {
          email
        }
      }

      expect(getters.walletEmail(state)).to.equal(email)
    })

    it('walletSeed', () => {
      const secretSeed = 'SB5N5RG66UKMZWPY6WRHFCASAIUHGNA3TIG5TOLGROLN67XQDCLWFVPG'
      const state = {
        wallet: {
          secretSeed
        }
      }

      expect(getters.walletSeed(state)).to.equal(secretSeed)
    })

    it('walletKeypair', () => {
      const keypair = base.Keypair.fromSecret('SBMS7EEEK3BSUWLSJL5OZY7VA5U6Y2PRSZO437RTVHFRGDZV6PGFMBYX')
      const state = {
        wallet: {
          keypair
        }
      }

      expect(getters.walletKeypair(state)).to.deep.equal(keypair)
    })

    it('walletPublicKey', () => {
      const keypair = base.Keypair.fromSecret('SDCDTZL6DTEZQSJRPFKVY4FYBX7V2HR2IRE6ZS7ADMADAVYZCZ2N62T5')
      const publicKey = 'GBYRGB5VPMGTT76PHRFJYVT4TV2UB5SXGWHCHQVT7MYLPMQ4FZY3EGVU' // manually calculated
      const state = {
        wallet: {
          keypair
        }
      }

      expect(getters.walletPublicKey(state)).to.equal(publicKey)
    })
  })
})
