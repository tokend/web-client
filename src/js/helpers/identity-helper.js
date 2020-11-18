import { errors } from '@/js/errors'
import { api } from '@/api'

/**
 * Fetches an account id by email
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
