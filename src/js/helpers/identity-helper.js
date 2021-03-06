import { errors } from '@/js/errors'
import { api } from '@/api'
import { email } from '@validators'

/**
 * Fetches an account id by identifier
 *
 * @param {string} identifier
 * @param {*} [defaultValue] Value returned if no email found. If not set an
 * instance of `UserDoesntExistError` thrown
 */
export async function getAccountIdByIdentifier (identifier, defaultValue) {
  if (typeof identifier !== 'string') {
    throw new TypeError(`getAccountIdByIdentifier(): 'email' arg should be a string, got ${identifier}`)
  }

  const { data } = await api.get('/identities', {
    filter: { identifier: identifier.toLowerCase() },
    page: { limit: 1 },
  })

  if (data && data[0]) {
    return data[0].address
  } else if (defaultValue !== undefined) {
    return defaultValue
  } else {
    throw new errors.UserDoesntExistError()
  }
}

/**
 * Fetches an account id by email
 *
 * @param {string} email
 * instance of `UserDoesntExistError` thrown
 */
async function getAccountIdByEmail (email) {
  const { data } = await api.get('/identities', {
    filter: { email },
    page: { limit: 1 },
  })

  if (data && data[0]) {
    return data[0].address
  } else {
    throw new errors.UserDoesntExistError()
  }
}

/**
 * Fetches a receiver account id by email or identifier
 *
 * @param {string} receiver: email or identifier
 */
export async function getReceiverAccountId (receiver) {
  let accountId

  if (email(receiver)) {
    accountId = await getAccountIdByEmail(receiver)
  } else {
    accountId = receiver
  }

  return accountId
}

/**
 * Fetches a receiver balance id by account id and asset code
 *
 * @param {string} receiverAccountId: account id of receiver
 * @param {string} assetCode: asset code
 */
export async function getReceiverBalanceId (receiverAccountId, assetCode) {
  const endpoint = `/v3/accounts/${receiverAccountId}`
  const { data: account } = await api.get(endpoint, {
    include: ['balances.asset'],
  })

  const balance = account.balances
    .find(item => item.asset.id === assetCode)

  return balance ? balance.id : ''
}
