import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class DepositDrawerPseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/forms/DepositForm'),
      ...opts,
    })
  }
}
