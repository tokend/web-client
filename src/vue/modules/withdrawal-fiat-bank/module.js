import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { WithdrawalFiatModule } from '@/vue/modules/withdrawal-fiat/module'

export class WithdrawalFiatBankModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/withdrawal-fiat-bank'),
      importStoreFn: async _ => {
        const { withdrawalFiatBankModule } = await import(
          '@/vue/modules/withdrawal-fiat-bank/store'
        )
        return withdrawalFiatBankModule
      },
      dependencies: [
        WithdrawalFiatModule,
      ],
      ...opts,
    })
  }
}
