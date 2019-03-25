import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class BuyBackFormModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/buy-back-form'),
      importStoreFn: async _ => {
        const { BuyBackFormModule } = await import(
          '@/vue/modules/buy-back-form/store'
        )
        return BuyBackFormModule
      },
      ...opts,
    })
  }
}
