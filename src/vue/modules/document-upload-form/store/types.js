const mutations = {
  SET_ACCOUNT_ID: 'SET_ACCOUNT_ID',
}

const actions = {
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  CREATE_CHANGE_ROLE_REQUEST: 'CREATE_CHANGE_ROLE_REQUEST',
  CREATE_BLOB: 'CREATE_BLOB',
}

const getters = {
  accountId: 'accountId',
}

export const types = {
  ...mutations,
  ...actions,
  ...getters,
}
