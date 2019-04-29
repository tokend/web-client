import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class AssetExplorerModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/assets/asset-explorer'),
      importStoreFn: async _ => {
        const { assetExplorerModule: res } =
          await import('@/vue/modules/assets/asset-explorer/store')
        return res
      },
      ...opts,
    })
  }
}
