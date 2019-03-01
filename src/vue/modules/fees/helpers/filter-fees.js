import { Fee } from '../wrappers/fee'

export function filterFees (fees, accountId, accountRoleId) {
  return fees
    .map(f => new Fee(f))
    .filter(f => !f.accountId || f.accountId === accountId)
    .filter(f => !f.accountRoleId || f.accountRoleId === accountRoleId)
}
