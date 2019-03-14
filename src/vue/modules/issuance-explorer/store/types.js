const mutations = {
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
  SET_ISSUANCES: 'SET_ISSUANCES',
  CONCAT_ISSUANCES: 'CONCAT_ISSUANCES',
}

const actions = {
  LOAD_ISSUANCES: 'LOAD_ISSUANCES',
}

const getters = {
  accountId: 'accountId',
  issuances: 'issuances',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
