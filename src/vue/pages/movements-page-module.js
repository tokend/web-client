import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { MovementsHistoryModule } from '@/vue/modules/movements-history/module'
import { WithdrawalDrawerPseudoModule } from '@/modules-arch/pseudo-modules/withdrawal-drawer-pseudo-module'
import { DepositFormPseudoModule } from '@/modules-arch/pseudo-modules/deposit-form-pseudo-module'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { DepositFiatModule } from '../modules/deposit-fiat/module'
import { WithdrawalFiatModule } from '../modules/withdrawal-fiat/module'
import { DividendFormModule } from '../modules/dividend-form/module'

export class MovementsHistoryPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Movements'),
      allowedSubmodules: [
        MovementsHistoryModule,
        WithdrawalDrawerPseudoModule,
        WithdrawalFiatModule,
        DepositFormPseudoModule,
        DepositFiatModule,
        TransferDrawerPseudoModule,
        DividendFormModule,
      ],
    })
  }
}
