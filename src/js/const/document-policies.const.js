import { DOCUMENT_TYPES } from './document-types.const'

const POLICIES = Object.freeze({
  public: 'general_public',
  private: 'general_private',
})

export const DOCUMENT_POLICIES = Object.freeze({
  [DOCUMENT_TYPES.saleLogo]: POLICIES.public,
  [DOCUMENT_TYPES.saleDocument]: POLICIES.public,
  [DOCUMENT_TYPES.kycIdDocument]: POLICIES.private,
  [DOCUMENT_TYPES.kycProofOfAddress]: POLICIES.private,
  [DOCUMENT_TYPES.kycSelfie]: POLICIES.private,
  [DOCUMENT_TYPES.kycAvatar]: POLICIES.public,
  [DOCUMENT_TYPES.kycTaxReturns]: POLICIES.private,
  [DOCUMENT_TYPES.kycOriginationCertificate]: POLICIES.private,
  [DOCUMENT_TYPES.kycInvestmentPresentation]: POLICIES.private,
  [DOCUMENT_TYPES.kycProofOfInvestor]: POLICIES.private,
  [DOCUMENT_TYPES.kycShareholdersCertificate]: POLICIES.private,
  [DOCUMENT_TYPES.kycAnnualReport]: POLICIES.private,
  [DOCUMENT_TYPES.kycMemorandium]: POLICIES.private,
  [DOCUMENT_TYPES.kycSignatoriesAuthorization]: POLICIES.private,
  [DOCUMENT_TYPES.kycOrganizationChart]: POLICIES.private,
  [DOCUMENT_TYPES.kycBusinessModel]: POLICIES.private,
  [DOCUMENT_TYPES.passport]: POLICIES.private,
  [DOCUMENT_TYPES.driving_license]: POLICIES.private,
  [DOCUMENT_TYPES.identity_card]: POLICIES.private,
  [DOCUMENT_TYPES.residence_permit]: POLICIES.private,
  [DOCUMENT_TYPES.assetTerms]: POLICIES.public,
  [DOCUMENT_TYPES.assetLogo]: POLICIES.public,
  [DOCUMENT_TYPES.healthcareDocument]: POLICIES.private,
})
