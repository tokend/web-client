import { DOCUMENT_TYPES } from './document-types.const'

const POLICIES = Object.freeze({
  public: 'general_public',
  private: 'general_private'
})

export const DOCUMENT_POLICIES = Object.freeze({
  [DOCUMENT_TYPES.saleLogo]: POLICIES.public,
  [DOCUMENT_TYPES.saleDocument]: POLICIES.public,
  [DOCUMENT_TYPES.assetTerms]: POLICIES.public,
  [DOCUMENT_TYPES.assetLogo]: POLICIES.public,
  [DOCUMENT_TYPES.kycIdDocument]: POLICIES.private,
  [DOCUMENT_TYPES.kycProofOfAddress]: POLICIES.private,
  [DOCUMENT_TYPES.kycSelfie]: POLICIES.private
})
