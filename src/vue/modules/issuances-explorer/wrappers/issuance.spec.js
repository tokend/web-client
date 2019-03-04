import { Issuance } from './issuance'

describe('Issuance', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const accountId = 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ'
      const record = {
        id: '1',
        createdAt: '2019-02-26T15:09:01Z',
        reference: 'ref',
        requestDetails: {
          amount: '100.000000',
          asset: {
            id: 'USD',
          },
          receiver: {
            id: 'BARK3WRP4M5WSW2ERWPQ3FEXA4A2AYNRSANIBRKQRC62JUI6SG3XDXK5',
          },
        },
      }

      const result = new Issuance(record, accountId)

      expect(result.id).to.equal('1')
      expect(result.amount).to.equal('100.000000')
      expect(result.asset).to.equal('USD')
      expect(result.date).to.equal('2019-02-26T15:09:01Z')
      expect(result.reference).to.equal('ref')
      expect(result.counterparty).to.equal('BARK3WRP4M5WSW2ERWPQ3FEXA4A2AYNRSANIBRKQRC62JUI6SG3XDXK5')
    })
  })
})
