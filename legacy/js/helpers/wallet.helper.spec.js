import { WalletHelper } from './wallet.helper'

describe('', () => {
  it('properly calculates recovery wallet id', () => {
    const seed = 'SD3NCO2HAQITY3SWUL6LE2RVWAWNHU5UHEG7J5JSUBETK3QHYXU477DC'
    const email = 'qwe@qeweq.com'
    const kdf = { algorithm: 'scrypt', bits: 256, n: 4096, r: 8, p: 1 }
    const salt = 'D3aG12DKt6Zl66Sqf77MuA=='

    const { walletId } = WalletHelper.calculateWalletParams(
      seed, email, salt, kdf
    )
    expect(walletId).to.equal('b08ecd5dd0ac4f97a8da6de0079a431eec92b901c24ad946fabea94e5cf5c093')
  })
})
