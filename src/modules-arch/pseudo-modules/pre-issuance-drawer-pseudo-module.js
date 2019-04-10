import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class PreIssuanceDrawerPseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/forms/PreIssuanceForm'),
      ...opts,
    })
  }
}
