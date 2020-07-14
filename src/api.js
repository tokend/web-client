import {
  ApiCaller,
  DocumentsManager,
  FactorsManager,
  WalletsManager,
} from '@tokend/js-sdk'
import config from '@/config'

export const api = new ApiCaller()

export const documentsManager = new DocumentsManager()
export const walletsManager = new WalletsManager()
export const factorsManager = new FactorsManager()

export async function initApi () {
  api.useBaseURL(config.HORIZON_SERVER)
  documentsManager.useStorageURL(config.FILE_STORAGE)

  const { data: networkDetails } = await api.getRaw('/')
  api.useNetworkDetails(networkDetails)

  walletsManager.useApi(api)
  factorsManager.useApi(api)
  documentsManager.useApi(api)
}

export function useWallet (newWallet) {
  api.useWallet(newWallet)

  documentsManager.useApi(api)
  factorsManager.useApi(api)
  walletsManager.useApi(api)
}
