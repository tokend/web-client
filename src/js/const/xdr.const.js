import { xdrEnumToConstant } from '../utils/xdr_enum_to_constant.util'

export const ACCOUNT_TYPES = Object.freeze(
  xdrEnumToConstant('AccountType')
)
