import { xdr } from 'tokend-js-sdk'

export function xdrEnumToConstant (xdrEnum) {
  xdrEnum = typeof xdrEnum === 'string'
    ? xdr[xdrEnum]
    : xdrEnum

  try {
    const res = {}
    xdrEnum.values().forEach(function (item) { res[item.name] = item.value })
    return res
  } catch (error) {
    throw new Error(`xdrEnumToConstant: Cannot get values from provided xdrEnum (${xdrEnum})`)
  }
}
