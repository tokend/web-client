import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class CoinpaymentsDepositModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@/vue/modules/coinpayments'),
      ...opts,
    })
  }
}
