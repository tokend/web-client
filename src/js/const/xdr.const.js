import { xdrEnumToConstant } from '../utils/xdr-enum-to-constant.util'

export const ACCOUNT_TYPES = Object.freeze(
  xdrEnumToConstant('AccountType')
)

export const OPERATION_TYPES = Object.freeze(
  xdrEnumToConstant('OperationType')
)

export const ASSET_POLICY = Object.freeze(
  xdrEnumToConstant('AssetPolicy')
)

export const FEE_TYPE = Object.freeze(
  xdrEnumToConstant('FeeType')
)
