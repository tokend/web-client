import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class VerificationGeneralFormModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/verification/general-form'),
      importStoreFn: async _ => {
        const { VerificationGeneralModule } = await import(
          '@/vue/modules/verification/general-form/store'
        )
        return VerificationGeneralModule
      },
      ...opts,
    })
  }
}
