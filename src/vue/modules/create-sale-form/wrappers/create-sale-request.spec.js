import { CreateSaleRequest } from './create-sale-request'

describe('Create sale request', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        requestDetails: {
          baseAsset: { id: 'TKN' },
          defaultQuoteAsset: {
            softCap: '100.000000',
            hardCap: '200.000000',
          },
          baseAssetForHardCap: '10.000000',
          startTime: '2019-03-18T10:22:00Z',
          endTime: '2019-04-18T15:25:00Z',
          creatorDetails: {
            name: 'Sale',
            description: 'SALE_DESCRIPTION_BLOB_ID',
            shortDescription: 'Some info',
            youtubeVideoId: 'YOUTUBE_VIDEO_ID',
            logo: { key: 'logo-key' },
          },
        },
      }

      const result = new CreateSaleRequest(record)

      expect(result.name).to.equal('Sale')

      expect(result.baseAsset).to.equal('TKN')
      expect(result.assetsToSell).to.equal('10.000000')

      expect(result.startTime).to.equal('2019-03-18T10:22:00Z')
      expect(result.endTime).to.equal('2019-04-18T15:25:00Z')

      expect(result.softCap).to.equal('100.000000')
      expect(result.hardCap).to.equal('200.000000')

      expect(result.descriptionBlobId).to.equal('SALE_DESCRIPTION_BLOB_ID')
      expect(result.shortDescription).to.equal('Some info')

      expect(result.logo).to.deep.equal({ key: 'logo-key' })
      expect(result.logoKey).to.equal('logo-key')

      expect(result.youtubeVideoId).to.equal('YOUTUBE_VIDEO_ID')
    })
  })

  describe('methods', () => {
    describe('_getQuoteAssets', () => {
      it('returns quote asset codes array', () => {
        const record = {
          requestDetails: {
            quoteAssets: [
              { id: 'USD' },
              { id: 'BTC' },
            ],
          },
        }
        const request = new CreateSaleRequest(record)

        expect(request._getQuoteAssets(record)).to.deep.equal(['USD', 'BTC'])
      })
    })
  })
})
