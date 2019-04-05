import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class UpdateAssetFormModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/update-asset-form'),
      ...opts,
    })
  }
}
