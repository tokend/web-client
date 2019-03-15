import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { WithdrawalFiatModule } from '@/vue/modules/withdrawal-fiat/module'

export class WithdrawalFiatCardModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/withdrawal-fiat-card'),
      importStoreFn: async _ => {
        const { withdrawalFiatCardModule } = await import(
          '@/vue/modules/withdrawal-fiat-card/store'
        )
        return withdrawalFiatCardModule
      },
      dependencies: [
        WithdrawalFiatModule,
      ],
      ...opts,
    })
  }
}
