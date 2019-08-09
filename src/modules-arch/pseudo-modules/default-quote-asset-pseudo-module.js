import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class DefaultQuoteAssetPseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/fields/DefaultQuoteAssetSelectField'),
      ...opts,
    })
  }
}
