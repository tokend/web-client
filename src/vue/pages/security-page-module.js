import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { ShowAccountIdPseudoModule } from '@/modules-arch/pseudo-modules/show-account-id-pseudo-module'
import { ShowSeedPseudoModule } from '@/modules-arch/pseudo-modules/show-seed-pseudo-module'
import { ChangePasswordPseudoModule } from '@/modules-arch/pseudo-modules/change-password-pseudo-module'
import { ShowNetworkPassphrasePseudoModule } from '@/modules-arch/pseudo-modules/show-network-passphrase-pseudo-module'
import { PhoneNumberFormPseudoModule } from '@/modules-arch/pseudo-modules/phone-number-form-pseudo-module'

export class SecurityPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Security'),
      allowedSubmodules: [
        ShowAccountIdPseudoModule,
        ShowSeedPseudoModule,
        ChangePasswordPseudoModule,
        ShowNetworkPassphrasePseudoModule,
        PhoneNumberFormPseudoModule,
      ],
    })
  }
}
