const mutations = {
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
  SET_PRE_ISSUANCE_REQUESTS: 'SET_PRE_ISSUANCE_REQUESTS',
  CONCAT_PRE_ISSUANCE_REQUESTS: 'CONCAT_PRE_ISSUANCE_REQUESTS',
}

const actions = {
  LOAD_PRE_ISSUANCE_REQUESTS: 'LOAD_PRE_ISSUANCE_REQUESTS',
}

const getters = {
  accountId: 'accountId',
  preIssuanceRequests: 'preIssuanceRequests',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
