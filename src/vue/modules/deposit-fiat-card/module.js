import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { DepositFiatModule } from '@/vue/modules/deposit-fiat/module'

export class DepositFiatCardModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/deposit-fiat-card'),
      importStoreFn: async _ => {
        const { depositFiatCardModule } = await import(
          '@/vue/modules/deposit-fiat-card/store'
        )
        return depositFiatCardModule
      },
      dependencies: [
        DepositFiatModule,
      ],
      ...opts,
    })
  }
}
