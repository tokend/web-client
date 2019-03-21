import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class WithdrawalDrawerPseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/forms/WithdrawalForm'),
      ...opts,
    })
  }
}
