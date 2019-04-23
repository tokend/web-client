import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class UpdateAssetRequestsModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/requests/update-asset-requests'),
      importStoreFn: async _ => {
        const { updateAssetRequestsModule: res } =
          await import('@/vue/modules/requests/update-asset-requests/store')
        return res
      },
      ...opts,
    })
  }
}
