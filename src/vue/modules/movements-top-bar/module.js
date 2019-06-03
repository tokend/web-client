import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { WithdrawalDrawerPseudoModule } from '@/modules-arch/pseudo-modules/withdrawal-drawer-pseudo-module'
import { DepositFormPseudoModule } from '@/modules-arch/pseudo-modules/deposit-form-pseudo-module'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'

export class MovementsTopBarModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/movements-top-bar'),
      allowedSubmodules: [
        WithdrawalDrawerPseudoModule,
        DepositFormPseudoModule,
        TransferDrawerPseudoModule,
      ],
      ...opts,
    })
  }
}
