import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class MyAssetsExplorerModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/assets/my-assets-explorer'),
      ...opts,
    })
  }
}
