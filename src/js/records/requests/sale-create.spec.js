import { MockWrapper } from '../../../test/index'
import { SaleRequestRecord } from './sale-create.record'

import saleCreateJSON from '../../../test/mocks/sale-create'

describe('SaleRequestRecord', () => {
  const getRecord = (rawJSON = saleCreateJSON) => {
    const sdkResponse = MockWrapper.makeHorizonData(rawJSON)
    return new SaleRequestRecord(sdkResponse)
  }

  const setQuoteAssets = (rawJSON, assets) => {
    rawJSON.details.sale.quote_assets = assets

    return rawJSON
  }

  const setLogoKey = (rawJSON, key) => {
    rawJSON.details.sale.details.logo = {}
    rawJSON.details.sale.details.logo.key = key

    return rawJSON
  }

  it('constructor should properly set all the basic fields', () => {
    const record = getRecord()

    expect(record.baseAsset)
      .to
      .equal(
        saleCreateJSON.details.sale.base_asset
      )

    expect(record.name)
      .to
      .equal(
        saleCreateJSON.details.sale.details.name
      )

    expect(record.defaultQuoteAsset)
      .to
      .equal(
        saleCreateJSON.details.sale.default_quote_asset
      )

    expect(record.startTime)
      .to
      .equal(
        saleCreateJSON.details.sale.start_time
      )

    expect(record.endTime)
      .to
      .equal(
        saleCreateJSON.details.sale.end_time
      )

    expect(record.softCap)
      .to
      .equal(
        saleCreateJSON.details.sale.soft_cap
      )

    expect(record.hardCap)
      .to
      .equal(
        saleCreateJSON.details.sale.hard_cap
      )

    expect(record.baseAssetForHardCap)
      .to
      .equal(
        saleCreateJSON.details.sale.base_asset_for_hard_cap
      )
  })

  it('constructor should properly set sale state fields', () => {
    const record = getRecord()

    expect(record.saleState)
      .to
      .equal(
        saleCreateJSON.details.sale.state.value
      )

    expect(record.saleStateStr)
      .to
      .equal(
        saleCreateJSON.details.sale.state.name
      )
  })

  it('constructor should properly set sale type fields', () => {
    const record = getRecord()

    expect(record.saleTypeStr)
      .to
      .equal(
        saleCreateJSON.details.sale.sale_type.name
      )

    expect(record.saleType)
      .to
      .equal(
        saleCreateJSON.details.sale.sale_type.value
      )
  })

  it('constructor should properly set all the details fields', () => {
    const record = getRecord()

    expect(record.description)
      .to
      .equal(
        saleCreateJSON.details.sale.details.description
      )

    expect(record.shortDescription)
      .to
      .equal(
        saleCreateJSON.details.sale.details.short_description
      )

    expect(record.youtubeVideoId)
      .to
      .equal(
        saleCreateJSON.details.sale.details.youtube_video_id
      )
  })

  it('constructor should properly set all the quote assets', () => {
    const quoteAssets = [
      { quote_asset: 'ETH', price: '1.000000' },
      { quote_asset: 'BTC', price: '1.000000' },
      { quote_asset: 'DASH', price: '1.000000' }
    ]
    const expectedResult = ['ETH', 'BTC', 'DASH']
    const rawJSON = setQuoteAssets(saleCreateJSON, quoteAssets)
    const record = getRecord(rawJSON)

    expect(record.quoteAssets).to.deep.equal(expectedResult)
  })

  it('constructor should properly logo details', () => {
    const record = getRecord()

    expect(record.logoKey)
      .to
      .equal(
        saleCreateJSON.details.sale.details.logo.key
      )

    expect(record.logoName)
      .to
      .equal(
        saleCreateJSON.details.sale.details.logo.name
      )

    expect(record.logoType)
      .to
      .equal(
        saleCreateJSON.details.sale.details.logo.type
      )
  })

  it('logoUrl getter returns proper value', () => {
    const storageUrl = 'https://storage.com'
    const key = 'fooEq112ewq134qweq41weqweqwe'
    const rawJSON = setLogoKey(saleCreateJSON, key)
    const record = getRecord(rawJSON)

    expect(record.logoUrl(storageUrl)).to.equal(`${storageUrl}/${key}`)
  })
})
