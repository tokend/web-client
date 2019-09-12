import { ModuleDescriptor } from '@/modules-arch/module-descriptor'

export class SponsorshipRequestsModule extends ModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@modules/requests/sponsorship-requests'),
      importStoreFn: async _ => {
        const { sponsorshipRequestsModule: res } =
          await import('@modules/requests/sponsorship-requests/store')
        return res
      },
      ...opts,
    })
  }
}
