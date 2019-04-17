import { base } from '@tokend/js-sdk'

let _config = {
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: String(base.Operation.MAX_INT64_AMOUNT),
  DECIMAL_POINTS: 2,
  RELOAD_DATA_TICKER_INTERVAL_MS: 10000,

  DEFAULT_POINT: 'PET',
  MERCHANT_NAME: 'Pets shop, Sumska 46',
  LOYALTY_ACCOUNTS: [
    {
      number: '992475256941',
      system: 'https://api.flowers.tokend.io',
      accountId: 'GDSARB4GFT72EMH7WTPUZPHFEPPU3MLP5HBWFA5IDNSQ4TTIBDC6TXRV',
      secretSeed: 'SCYF7TYAPHNGRVQBYHGQR7QNC733RPMHXW64JXRFAHFUTJACCH6TA75V',
    },
    {
      number: '992475256941',
      system: 'https://api.gasstation.tokend.io',
      accountId: 'GBSJHO5CGQ3TU4FONWWNXC7TFWRX5SKANXXRGBCQOCJW463BR4VHNFWS',
      secretSeed: 'SBOISN4L4PJOAKHREFNRLGQTMRDGPZTXGZHSK37ZEIYFKVU3SY34ACPZ',
    },
  ],
}

/**
 * @param {string} horizonURL - the URL of the horizon server
 */
export function initConfig ({ horizonURL }) {
  if (!horizonURL) {
    throw new Error('horizonURL is not provided')
  }

  _config.horizonURL = horizonURL
}

export function config () {
  return _config
}
