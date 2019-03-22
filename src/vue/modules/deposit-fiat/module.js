import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { DepositFiatCardModule } from '@/vue/modules/deposit-fiat-card/module'
import { DepositFiatBankModule } from '@/vue/modules/deposit-fiat-bank/module'

export class DepositFiatModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/deposit-fiat'),
      allowedSubmodules: [
        DepositFiatCardModule,
        DepositFiatBankModule,
      ],
      ...opts,
    })
  }
}
