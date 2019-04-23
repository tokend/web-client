import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'

import { VerificationGeneralFormModule } from '@/vue/modules/verification/general-form/module'

export class VerificationGeneralPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/VerificationGeneral2'),
      allowedSubmodules: [
        VerificationGeneralFormModule,
      ],
    })
  }
}
