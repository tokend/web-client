import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { WithdrawalFiatCardModule } from '@/vue/modules/withdrawal-fiat-card/module'
import { WithdrawalFiatBankModule } from '@/vue/modules/withdrawal-fiat-bank/module'

export class WithdrawalFiatModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/withdrawal-fiat'),
      importStoreFn: async _ => {
        const { withdrawalFiatModule } = await import(
          '@/vue/modules/withdrawal-fiat/store'
        )
        return withdrawalFiatModule
      },
      allowedSubmodules: [
        WithdrawalFiatCardModule,
        WithdrawalFiatBankModule,
      ],
      ...opts,
    })
  }
}
