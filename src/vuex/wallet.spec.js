import { walletsManager } from '@/api'

import { mutations, actions, getters } from './wallet.module'
import { vuexTypes } from './types'

import { Wallet } from '@tokend/js-sdk'

describe('wallet.module', () => {
  const mockSeed = 'SAG3O2PBA3KAAUP3E3WRHRI5NM5GFKQIOXBNHP7B4VMWYYOAN6OFAHA4'
  // PK = GDYMQR4ZNISMAVBTEKNKD63JSWRR4D3FHNBZSW36MDM3E3J32QUOQLU2

  const mockWallet = new Wallet(
    'alice@mail.com',
    mockSeed,
    'GA7QET54X3WDJPMGRKTE32WKM4NRLKKKHHI74NXNMNTQR3VONA3XGIBP',
    '01DES43BFYPNHGRWY4TZKNC60W',
    '4aadcd4eb44bb845d828c45dbd68d5d1196c3a182b08cd22f05c56fcf15b153c',
  )

  afterEach(() => {
    sinon.restore()
  })

  describe('mutations', () => {
    it('SET_WALLET should properly modify state', () => {
      const state = { wallet: {} }
      sinon.stub(mockWallet.keypair, 'accountId').returns('GDYMQR4ZNISMAVBTEKNKD63JSWRR4D3FHNBZSW36MDM3E3J32QUOQLU2')
      const expectedWallet = {
        email: mockWallet.email,
        id: mockWallet.id,
        accountId: mockWallet.accountId,
        sessionId: mockWallet.sessionId,
        publicKey: mockWallet.keypair.accountId(),
      }

      mutations[vuexTypes.SET_WALLET](state, mockWallet)
      expect(state).to.deep.equal({ wallet: expectedWallet })
    })
  })

  describe('actions', () => {
    let store

    beforeEach(() => {
      store = {
        state: {},
        getters: {},
        commit: sinon.stub(),
        dispatch: sinon.stub(),
      }
    })

    it('LOAD_WALLET commits proper set of mutations', async () => {
      sinon.stub(walletsManager, 'get').resolves(mockWallet)

      const credentials = { email: 'bob@mail.com', password: 'qweqweqwe' }
      const expectedMutations = {
        [vuexTypes.SET_WALLET]: mockWallet,
        [vuexTypes.SET_ENCRYPTED_SECRET_SEED]: {
          secretSeed: mockWallet.secretSeed,
          sessionKey: mockWallet.sessionKey,
        },
      }
      await actions[vuexTypes.LOAD_WALLET](store, credentials)
      expect(store.commit.args)
        .to.deep.equal(Object.entries(expectedMutations))
    })
  })

  describe('getters', () => {
    it('walletId', () => {
      const id = '0a0dc11el4lkf845d828c45dbd68d5d1196c3a182b08cd22f05c51fcf15w153c'
      const _state = {
        wallet: {
          id,
        },
      }

      expect(getters[vuexTypes.walletId](_state, {}))
        .to
        .equal(id)
    })

    it('walletEmail', () => {
      const email = 'foo@bar.com'
      const _state = {
        wallet: {
          email,
        },
      }

      expect(getters[vuexTypes.walletEmail](_state, {}))
        .to
        .equal(email)
    })
  })
})
