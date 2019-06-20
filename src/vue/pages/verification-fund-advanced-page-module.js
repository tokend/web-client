import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'

import { VerificationFundFormModule } from '@/vue/modules/verification/fund-form/module'

export class VerificationFundAdvancedPageModule
  extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/VerificationFundAdvanced'),
      allowedSubmodules: [
        VerificationFundFormModule,
      ],
    })
  }
}
