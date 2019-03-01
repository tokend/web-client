const mutations = {
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
  SET_ACCOUNT_ROLE_ID: 'SET_ACCOUNT_ROLE_ID',
  SET_FEES: 'SET_FEES',
  CONCAT_FEES: 'CONCAT_FEES',
}

const actions = {
  LOAD_FEES: 'LOAD_FEES',
}

const getters = {
  accountId: 'accountId',
  accountRoleId: 'accountRoleId',
  fees: 'fees',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
