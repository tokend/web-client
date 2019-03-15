import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { VerificationPageModule } from './verification-page-module'
import { SecurityPageModule } from './security-page-module'

export class SettingsPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Settings'),
      allowedSubmodules: [
        VerificationPageModule,
        SecurityPageModule,
      ],
    })
  }
}
