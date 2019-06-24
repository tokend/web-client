import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class CreateAssetFormSimplifiedModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/create-asset-form-simplified'),
      ...opts,
    })
  }
}
