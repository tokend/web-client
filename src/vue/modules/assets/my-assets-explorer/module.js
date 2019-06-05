import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class MyAssetsExplorerModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/assets/my-assets-explorer'),
      importStoreFn: async _ => {
        const { myAssetsExplorerModule: res } =
          await import('@/vue/modules/assets/my-assets-explorer/store')
        return res
      },
      ...opts,
    })
  }
}
