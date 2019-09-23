import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'
import { ShowAccountIdPseudoModule } from '@/modules-arch/pseudo-modules/show-account-id-pseudo-module'
import { ChangePasswordPseudoModule } from '@/modules-arch/pseudo-modules/change-password-pseudo-module'
import { PhoneNumberFormPseudoModule } from '@/modules-arch/pseudo-modules/phone-number-form-pseudo-module'
import { TelegramFormPseudoModule } from '@/modules-arch/pseudo-modules/telegram-form-pseudo-module'
import { DefaultQuoteAssetPseudoModule } from '@/modules-arch/pseudo-modules/default-quote-asset-pseudo-module'

export class SecurityPageModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      ...opts,
      importComponentFn: _ => import('@/vue/pages/Security'),
      allowedSubmodules: [
        ShowAccountIdPseudoModule,
        ChangePasswordPseudoModule,
        PhoneNumberFormPseudoModule,
        TelegramFormPseudoModule,
        DefaultQuoteAssetPseudoModule,
      ],
    })
  }
}
