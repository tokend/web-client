import { ApiCaller, WalletsManager, FactorsManager } from '@tokend/js-sdk'

export const api = new ApiCaller({})
export const walletsManager = new WalletsManager()
export const factorsManager = new FactorsManager()

export function useWallet (newWallet) {
  api.useWallet(newWallet)
  walletsManager.useApi(api)
  factorsManager.useApi(api)
}
