import { CreateSaleRequest } from './create-sale-request'
import { SALE_DEFINITION_TYPES } from '@/js/const/sale-definition-types.const'

describe('Create sale request', () => {
  describe('constructor', () => {
    it('should properly parse record', () => {
      const record = {
        requestDetails: {
          baseAsset: { id: 'TKN' },
          defaultQuoteAsset: { id: 'USD' },
          baseAssetForHardCap: '10.000000',
          softCap: '100.000000',
          hardCap: '200.000000',
          startTime: '2019-03-18T10:22:00Z',
          endTime: '2019-04-18T15:25:00Z',
          creatorDetails: {
            name: 'Sale',
            description: 'SALE_DESCRIPTION_BLOB_ID',
            shortDescription: 'Some info',
            youtubeVideoId: 'YOUTUBE_VIDEO_ID',
            logo: { key: 'logo-key' },
          },
          accessDefinitionType: {
            name: 'whitelist',
            value: 2,
          },
        },
      }

      const result = new CreateSaleRequest(record)

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

      expect(result.logo).to.deep.equal({ key: 'logo-key' })

      expect(result.youtubeVideoId).to.equal('YOUTUBE_VIDEO_ID')
      expect(result.definitionType).to.equal(SALE_DEFINITION_TYPES.whitelist)
    })
  })

  describe('getters', () => {
    describe('youtubeVideoUrl', () => {
      it('returns video link if youtube video ID is present', () => {
        const request = new CreateSaleRequest({
          requestDetails: {
            creatorDetails: { youtubeVideoId: 'video-id' },
          },
        })

        expect(request.youtubeVideoUrl)
          .to.equal('https://www.youtube.com/watch?v=video-id')
      })

      it('returns empty string if youtube video ID is absent', () => {
        const request = new CreateSaleRequest({})

        expect(request.youtubeVideoUrl).to.equal('')
      })
    })
    describe('isWhitelisted', () => {
      it('returns true if the request has whitelisted access definition type', () => {
        const request = new CreateSaleRequest({
          requestDetails: {
            accessDefinitionType: {
              name: 'whitelist',
              value: 2,
            },
          },
        })

        expect(request.isWhitelisted).to.be.true
      })

      it('returns false if the request hasn`t whitelisted access definition type', () => {
        const request = new CreateSaleRequest({
          requestDetails: {
            accessDefinitionType: {
              name: 'blacklist',
              value: 3,
            },
          },
        })

        expect(request.isWhitelisted).to.be.false
      })
    })
  })
})
