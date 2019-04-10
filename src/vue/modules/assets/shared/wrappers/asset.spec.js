import { Asset } from './asset'

import { ASSET_POLICIES } from '@tokend/js-sdk'

describe('Asset', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        id: 'USD',
        type: 0,
        issued: '100.000000',
        maxIssuanceAmount: '3000.000000',
        availableForIssuance: '2900.000000',
        owner: {
          id: 'GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ',
        },
        policies: {
          flags: [{
            name: 'transferable',
            value: 1,
          }],
          value: 1,
        },
        details: {
          name: 'American Dollar',
          logo: {
            key: 'logo-key',
          },
          terms: {
            key: 'terms-key',
          },
        },
      }
      const balance = '10.000000'

      const result = new Asset(record, balance)

      expect(result.code).to.equal('USD')
      expect(result.type).to.equal(0)
      expect(result.name).to.equal('American Dollar')

      expect(result.issued).to.equal('100.000000')
      expect(result.maxIssuanceAmount).to.equal('3000.000000')
      expect(result.availableForIssuance).to.equal('2900.000000')

      expect(result.logo).to.deep.equal({ key: 'logo-key' })
      expect(result.logoKey).to.equal('logo-key')

      expect(result.terms).to.deep.equal({ key: 'terms-key' })
      expect(result.termsKey).to.equal('terms-key')

      expect(result.policy).to.equal(1)
      expect(result.policies).to.deep.equal([{
        name: 'transferable',
        value: 1,
      }])

      expect(result.owner).to.equal('GDIU5OQPAFPNBP75FQKMJTWSUKHTQTBTHXZWIZQR4DG4QRVJFPML6TTJ')
      expect(result.balance).to.equal('10.000000')
    })
  })

  describe('getter', () => {
    describe('isTransferable', () => {
      it('returns proper value', () => {
        const transferableAsset = new Asset({
          policies: {
            value: ASSET_POLICIES.transferable,
          },
        })
        const notTransferableAsset = new Asset({
          policies: {
            value: 0,
          },
        })

        expect(transferableAsset.isTransferable).to.be.true
        expect(notTransferableAsset.isTransferable).to.be.false
      })
    })

    describe('isWithdrawable', () => {
      it('returns proper value', () => {
        const withdrawableAsset = new Asset({
          policies: {
            value: ASSET_POLICIES.withdrawable,
          },
        })
        const notWithdrawableAsset = new Asset({
          policies: {
            value: 0,
          },
        })

        expect(withdrawableAsset.isWithdrawable).to.be.true
        expect(notWithdrawableAsset.isWithdrawable).to.be.false
      })
    })
  })

  describe('method', () => {
    describe('logoUrl', () => {
      it('returns proper asset logo URL', () => {
        const storageUrl = 'https://storage.com'
        const key = 'logo-key'

        const asset = new Asset({ details: { logo: { key } } })

        expect(asset.logoUrl(storageUrl))
          .to.equal('https://storage.com/logo-key')
      })
    })

    describe('termsUrl', () => {
      it('returns proper asset terms URL', () => {
        const storageUrl = 'https://storage.com'
        const key = 'terms-key'

        const asset = new Asset({ details: { terms: { key } } })

        expect(asset.termsUrl(storageUrl))
          .to.equal('https://storage.com/terms-key')
      })
    })
  })
})
