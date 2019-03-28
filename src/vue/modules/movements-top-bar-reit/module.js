import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { TransferDrawerPseudoModule } from '@/modules-arch/pseudo-modules/transfer-drawer-pseudo-module'
import { DepositFiatModule } from '@modules/deposit-fiat/module'
import { WithdrawalFiatModule } from '@modules/withdrawal-fiat/module'
import { RedeemFormModule } from '@modules/redeem-form/module'

export class MovementsTopBarReitModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/movements-top-bar-reit'),
      importStoreFn: async _ => {
        const { MovementsTopBarReitModule } = await import(
          '@/vue/modules/movements-top-bar-reit/store'
        )
        return MovementsTopBarReitModule
      },
      allowedSubmodules: [
        WithdrawalFiatModule,
        DepositFiatModule,
        TransferDrawerPseudoModule,
        RedeemFormModule,
      ],
      ...opts,
    })
  }
}
