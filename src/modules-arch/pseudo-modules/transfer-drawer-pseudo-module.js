import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class TransferDrawerPseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/forms/TransferForm'),
      ...opts,
    })
  }
}
