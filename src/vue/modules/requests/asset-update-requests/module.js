import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class AssetUpdateRequestsModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/requests/asset-update-requests'),
      importStoreFn: async _ => {
        const { assetUpdateRequestsModule: res } =
          await import('@/vue/modules/requests/asset-update-requests/store')
        return res
      },
      ...opts,
    })
  }
}
