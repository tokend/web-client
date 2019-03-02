import { Issuance } from './issuance'

describe('Issuance', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const accountId = 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ'
      const record = {
        id: '1',
        amount: '100.000000',
        asset: 'USD',
        ledgerCloseTime: '2019-02-26T15:09:01Z',
        reference: 'ref',
        participants: [{
          accountId,
        }],
      }

      const result = new Issuance(record, accountId)

      expect(result.id).to.equal('1')
      expect(result.amount).to.equal('100.000000')
      expect(result.asset).to.equal('USD')
      expect(result.date).to.equal('2019-02-26T15:09:01Z')
      expect(result.reference).to.equal('ref')

      expect(result.accountId).to.equal('GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ')
      expect(result.participants).to.deep.equal([{
        accountId: 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
      }])
    })
  })

  describe('getter', () => {
    describe('counterparty', () => {
      it('should return participant account ID that is not equal to the record account ID', () => {
        const accountId = 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ'
        const issuance = new Issuance({
          participants: [{
            accountId,
          }, {
            accountId: 'SOME_OTHER',
          }],
        }, accountId)

        const result = issuance.counterparty

        expect(result).to.equal('SOME_OTHER')
      })

      it('should return record account ID if issuance was created by account with that ID (both participants have that account ID)', () => {
        const accountId = 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ'
        const issuance = new Issuance({
          participants: [{ accountId }],
        }, accountId)

        const result = issuance.counterparty

        expect(result).to.equal('GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ')
      })
    })
  })
})
