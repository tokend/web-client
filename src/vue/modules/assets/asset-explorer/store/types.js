const mutations = {
  SET_KYC_REQUIRED_ASSET_TYPE: 'SET_KYC_REQUIRED_ASSET_TYPE',
  SET_SECURITY_ASSET_TYPE: 'SET_SECURITY_ASSET_TYPE',
}

const actions = {
  CREATE_BALANCE: 'CREATE_BALANCE',
  LOAD_KYC_REQUIRED_ASSET_TYPE: 'LOAD_KYC_REQUIRED_ASSET_TYPE',
  LOAD_SECURITY_ASSET_TYPE: 'LOAD_SECURITY_ASSET_TYPE',
}

const getters = {
  kycRequiredAssetType: 'kycRequiredAssetType',
  securityAssetType: 'securityAssetType',
}

export const types = {
  ...actions,
  ...mutations,
  ...getters,
}
