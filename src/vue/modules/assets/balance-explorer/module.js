import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class BalanceExplorerModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/assets/balance-explorer'),
      importStoreFn: async _ => {
        const { balanceExplorerModule: res } =
          await import('@/vue/modules/assets/balance-explorer/store')
        return res
      },
      ...opts,
    })
  }
}
