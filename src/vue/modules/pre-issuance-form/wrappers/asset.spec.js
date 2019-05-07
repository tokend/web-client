import { Asset } from './asset'

describe('Asset', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        id: 'USD',
        owner: { id: 'SOME_ACCOUNT_ID' },
      }

      const result = new Asset(record)

      expect(result.code).to.equal('USD')
      expect(result.owner).to.equal('SOME_ACCOUNT_ID')
    })
  })
})
