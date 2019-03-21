import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { DepositFiatModule } from '@/vue/modules/deposit-fiat/module'

export class DepositFiatBankModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/deposit-fiat-bank'),
      importStoreFn: async _ => {
        const { depositFiatBankModule } = await import(
          '@/vue/modules/deposit-fiat-bank/store'
        )
        return depositFiatBankModule
      },
      dependencies: [
        DepositFiatModule,
      ],
      ...opts,
    })
  }
}
