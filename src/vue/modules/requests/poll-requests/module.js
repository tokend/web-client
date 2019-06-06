import { PageModuleDescriptor } from '@/modules-arch/page-module-descriptor'

export class PollRequestsModule extends PageModuleDescriptor {
  constructor (opts = {}) {
    super({
      importComponentFn: _ => import('@modules/requests/poll-requests'),
      importStoreFn: async _ => {
        const { pollRequestsModule: res } =
          await import('@modules/requests/poll-requests/store')
        return res
      },
      ...opts,
    })
  }
}
