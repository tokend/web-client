import {
  ApiCaller,
  DocumentsManager,
  FactorsManager,
  WalletsManager,
  Document,
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
  Document.useDocumentsManager(documentsManager)
}

export function useWallet (newWallet) {
  api.useWallet(newWallet)

  factorsManager.useApi(api)
  walletsManager.useApi(api)
  documentsManager.useApi(api)
  Document.useDocumentsManager(documentsManager)
}
