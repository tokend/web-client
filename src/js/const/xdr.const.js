import { xdrEnumToConstant } from '../utils/xdr-enum-to-constant.util'

export const ACCOUNT_TYPES = Object.freeze(
  xdrEnumToConstant('AccountType')
)

export const ASSET_POLICIES = Object.freeze(
  xdrEnumToConstant('AssetPolicy')
)
