const mutations = {
  SET_ACCOUNT_BALANCES: 'SET_ACCOUNT_BALANCES',
  SET_ASSETS: 'SET_ASSETS',
  SET_KYC_REQUIRED_ASSET_TYPE: 'SET_KYC_REQUIRED_ASSET_TYPE',
  SET_SECURITY_ASSET_TYPE: 'SET_SECURITY_ASSET_TYPE',
}

const actions = {
  LOAD_ACCOUNT_BALANCES: 'LOAD_ACCOUNT_BALANCES',
  LOAD_KYC_REQUIRED_ASSET_TYPE: 'LOAD_KYC_REQUIRED_ASSET_TYPE',
  LOAD_SECURITY_ASSET_TYPE: 'LOAD_SECURITY_ASSET_TYPE',
}

const getters = {
  assets: 'assets',
  kycRequiredAssetType: 'kycRequiredAssetType',
  securityAssetType: 'securityAssetType',
}

export const types = {
  ...actions,
  ...mutations,
  ...getters,
}
