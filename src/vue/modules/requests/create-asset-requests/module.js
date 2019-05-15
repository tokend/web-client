import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class CreateAssetRequestsModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@modules/requests/create-asset-requests'),
      importStoreFn: async _ => {
        const { createAssetRequestsModule: res } =
          await import('@modules/requests/create-asset-requests/store')
        return res
      },
      ...opts,
    })
  }
}
