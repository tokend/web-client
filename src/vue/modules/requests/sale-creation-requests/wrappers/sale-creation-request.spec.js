import { SaleCreationRequest } from './sale-creation-request'

describe('Sale creation request', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        requestDetails: {
          baseAsset: { id: 'TKN' },
          defaultQuoteAsset: {
            id: 'USD',
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
            logo: {
              key: 'dpurex4infnebjhcost7fvpmwbkjdkfxwegfwxy7lhthh7i3oydard55',
            },
          },
        },
      }

      const result = new SaleCreationRequest(record)

      expect(result.name).to.equal('Sale')

      expect(result.baseAsset).to.equal('TKN')
      expect(result.defaultQuoteAsset).to.equal('USD')
      expect(result.baseAssetForHardCap).to.equal('10.000000')

      expect(result.startTime).to.equal('2019-03-18T10:22:00Z')
      expect(result.endTime).to.equal('2019-04-18T15:25:00Z')

      expect(result.softCap).to.equal('100.000000')
      expect(result.hardCap).to.equal('200.000000')

      expect(result.description).to.equal('SALE_DESCRIPTION_BLOB_ID')
      expect(result.shortDescription).to.equal('Some info')

      expect(result.logo).to.deep.equal({
        key: 'dpurex4infnebjhcost7fvpmwbkjdkfxwegfwxy7lhthh7i3oydard55',
      })
      expect(result.logoKey).to.equal('dpurex4infnebjhcost7fvpmwbkjdkfxwegfwxy7lhthh7i3oydard55')

      expect(result.youtubeVideoId).to.equal('YOUTUBE_VIDEO_ID')
    })
  })

  describe('methods', () => {
    describe('logoUrl', () => {
      it('returns storage logo URL if logo key is present', () => {
        const request = new SaleCreationRequest({
          requestDetails: {
            creatorDetails: {
              logo: {
                key: 'dpurex4infnebjhcost7fvpmwbkjdkfxwegfwxy7lhthh7i3oydard55',
              },
            },
          },
        })

        expect(request.logoUrl('https://storage.com'))
          .to.equal('https://storage.com/dpurex4infnebjhcost7fvpmwbkjdkfxwegfwxy7lhthh7i3oydard55')
      })

      it('returns empty string if logo key is absent', () => {
        const request = new SaleCreationRequest({})

        expect(request.logoUrl('https://storage.com')).to.equal('')
      })
    })

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
        const request = new SaleCreationRequest(record)

        expect(request._getQuoteAssets(record)).to.deep.equal(['USD', 'BTC'])
      })
    })
  })

  describe('getters', () => {
    describe('youtubeVideoUrl', () => {
      it('returns video link if youtube video ID is present', () => {
        const request = new SaleCreationRequest({
          requestDetails: {
            creatorDetails: {
              youtubeVideoId: 'YOUTUBE_VIDEO_ID',
            },
          },
        })

        expect(request.youtubeVideoUrl)
          .to.equal('https://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID')
      })

      it('returns empty string if youtube video ID is absent', () => {
        const request = new SaleCreationRequest({})

        expect(request.youtubeVideoUrl).to.equal('')
      })
    })
  })
})
