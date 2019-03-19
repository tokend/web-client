import { ModuleDescriptor } from '@/modules-arch/module-descriptor'
import { CoinpaymentsModule } from '@/vue/modules/coinpayments/module'

export class DepositFormPseudoModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/forms/DepositForm'),
      allowedSubmodules: [CoinpaymentsModule],
      ...opts,
    })
  }
}
