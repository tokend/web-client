export const ASSET_SUBTYPE = {
  bond: 'bond',
  share: 'share',
}

export const ASSET_SUBTYPE_IMG_URL = {
  bondLogo: 'https://s3-eu-west-1.amazonaws.com/881e65d1943e42/pu/BOND.png',
  shareLogo: 'https://s3-eu-west-1.amazonaws.com/881e65d1943e42/pu/share.png',
}

export const STELLAR_TYPES = {
  creditAlphanum4: 'credit_alphanum4',
  creditAlphanum12: 'credit_alphanum12',
  native: 'native',
}

export const STELLAR_ASSET_TYPES = [
  {
    translationId: 'asset-form.alphanumeric-4-lbl',
    value: STELLAR_TYPES.creditAlphanum4,
  },
  {
    translationId: 'asset-form.alphanumeric-12-lbl',
    value: STELLAR_TYPES.creditAlphanum12,
  },
  {
    translationId: 'asset-form.native-lbl',
    value: STELLAR_TYPES.native,
  },
]
export const CREDIT_ALPHANUM4_MAX_LENGTH = 4

export const CREDIT_ALPHANUM12_MIN_LENGTH = 5

export const CREDIT_ALPHANUM12_MAX_LENGTH = 12

export const NATIVE_XLM_TYPE = 'XLM'
