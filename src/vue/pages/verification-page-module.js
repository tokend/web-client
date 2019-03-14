import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { VerificationCorporatePageModule } from './verification-corporate-page-module'
import { VerificationGeneralPageModule } from './veirification-general-page-module'

export class VerificationPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Verification'),
      allowedSubmodules: [
        VerificationCorporatePageModule,
        VerificationGeneralPageModule,
      ],
    })
  }
}
