import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { BalanceExplorerModule } from '@modules/assets/balance-explorer/module'

export class BalancesPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Balances'),
      allowedSubmodules: [
        BalanceExplorerModule,
      ],
    })
  }
}
