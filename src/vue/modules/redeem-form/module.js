import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class RedeemFormModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/redeem-form'),
      importStoreFn: async _ => {
        const { RedeemFormModule } = await import(
          '@/vue/modules/redeem-form/store'
        )
        return RedeemFormModule
      },
      ...opts,
    })
  }
}
