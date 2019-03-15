import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class AssetCreationRequestsModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/requests/asset-creation-requests'),
      importStoreFn: async _ => {
        const { assetCreationRequestsModule: res } =
          await import('@/vue/modules/requests/asset-creation-requests/store')
        return res
      },
      ...opts,
    })
  }
}
