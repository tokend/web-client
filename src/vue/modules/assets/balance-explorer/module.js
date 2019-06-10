import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class BalanceExplorerModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/assets/balance-explorer'),
      ...opts,
    })
  }
}
