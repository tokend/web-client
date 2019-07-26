import { Movement } from './movement'

describe('Movement', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        id: '176093659138',
        type: 'participant-effects',
        account: {
          id: 'GBLNPSWD7LJIDZJUFNVXPA3DI5ID4EPPYMDPQ6ULZEIUJSFITT3S2OK6',
          type: 'accounts',
        },
        asset: {
          id: 'BTC',
          type: 'assets',
        },
        balance: {
          id: 'BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ',
          type: 'balances',
        },
      }

      const result = new Movement(record)

      expect(result.balanceId).to.equal('BDPFDXJAL6UY53L52NNWPD7RTAO4EVZL55SWHNYVYJQ44BOEIQKL4FOJ')
      expect(result.assetCode).to.equal('BTC')
    })
  })
})
