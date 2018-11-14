export const MAX_FILE_MEGABYTES = 5

export const MAX_FILE_BYTES = MAX_FILE_MEGABYTES * 1024 * 1024

export const blobTypes = Object.freeze({
  assetDescription: {
    str: 'asset_description',
    num: 1
  },
  fundOverview: {
    str: 'fund_overview',
    num: 2
  },
  fundUpdate: {
    str: 'fund_update',
    num: 4
  },
  navUpdate: {
    str: 'nav_update',
    num: 8
  },
  fundDocument: {
    str: 'fund_document',
    num: 16
  },
  syndicate_kyc: {
    str: 'alpha',
    num: 32
  },
  bravo: {
    str: 'bravo',
    num: 64
  },
  charlie: {
    str: 'charlie',
    num: 128
  },
  delta: {
    str: 'delta',
    num: 256
  },
  tokenTerms: {
    str: 'token_terms',
    num: 512
  },
  tokenMetrics: {
    str: 'token_metrics',
    num: 1024
  },
  kycForm: {
    str: 'kyc_form',
    num: 2048
  }
})

export const blobFilters = Object.freeze({
  fundID: 'fund_id',
  tokenCode: 'token_code',
  type: 'type',
  fundOwner: 'fund_owner',
  kycSequence: 'kyc_sequence'
})

export const documentTypes = Object.freeze({
  fundLogo: 'fund_logo',
  fundDocument: 'fund_document',
  navReport: 'nav_report',
  syndicate_member_photo: 'alpha',
  bravo: 'bravo',
  charlie: 'charlie',
  delta: 'delta',
  tokenTerms: 'token_terms',
  tokenIcon: 'asset_logo',
  tokenMetrics: 'token_metrics',
  kycIdDocument: 'kyc_id_document',
  kycProofOfAddress: 'kyc_poa',
  kycSelfie: 'kyc_selfie',
  limitsProofOfIncome: 'limits_poi'
})
