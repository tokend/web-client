import { Balance } from './balance'

describe('Balance', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        id: '176093659138',
        asset: {
          id: 'BTC',
          type: 'assets',
        },
      }

      const result = new Balance(record)

      expect(result.id).to.equal('176093659138')
      expect(result.assetCode).to.equal('BTC')
    })
  })
})
