const mutations = {
  SET_REQUESTS: 'SET_REQUESTS',
  CONCAT_REQUESTS: 'CONCAT_REQUESTS',
  SET_KYC_REQUIRED_ASSET_TYPE: 'SET_KYC_REQUIRED_ASSET_TYPE',
  SET_SECURITY_ASSET_TYPE: 'SET_SECURITY_ASSET_TYPE',
}

const actions = {
  LOAD_REQUESTS: 'LOAD_REQUESTS',
  LOAD_KYC_REQUIRED_ASSET_TYPE: 'LOAD_KYC_REQUIRED_ASSET_TYPE',
  LOAD_SECURITY_ASSET_TYPE: 'LOAD_SECURITY_ASSET_TYPE',
  CANCEL_REQUEST: 'CANCEL_REQUEST',
}

const getters = {
  requests: 'requests',
  kycRequiredAssetType: 'kycRequiredAssetType',
  securityAssetType: 'securityAssetType',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
