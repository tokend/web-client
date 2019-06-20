import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class VerificationFundFormModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/verification/fund-form'),
      importStoreFn: async _ => {
        const { VerificationFundModule } = await import(
          '@/vue/modules/verification/fund-form/store'
        )
        return VerificationFundModule
      },
      ...opts,
    })
  }
}
