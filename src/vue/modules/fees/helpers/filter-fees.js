import { Fee } from '../wrappers/fee'

// HACK: fees are filtered by specific account ID and account role ID.
// If neither of them is present the fee is considered to be general.
export function filterFees (fees, accountId, accountRoleId) {
  return fees
    .map(f => new Fee(f))
    .filter(f => !f.accountId || f.accountId === accountId)
    .filter(f => !f.accountRoleId || f.accountRoleId === accountRoleId)
}
