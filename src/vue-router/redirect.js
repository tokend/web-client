import { vueRoutes } from './routes'

const REDIRECT_TYPES = {
  apiVerify: 'api-verify',
  inviteVerify: 'invite-verify',
}

export const resolveRedirect = (to, from, next) => {
  const encodedValue = to.path.replace('/r/', '')
  const decodedValue = JSON.parse(atob(encodedValue))

  switch (decodedValue.type) {
    case REDIRECT_TYPES.apiVerify:
      handleEmailRedirect(encodedValue, next)
      break
    case REDIRECT_TYPES.inviteVerify:
      handleInviteRedirect(decodedValue.meta, next)
      break
  }
}

function handleEmailRedirect (encodedVerificationCode, next) {
  next({
    ...vueRoutes.login,
    params: { encodedVerificationCode },
  })
}

function handleInviteRedirect (decodedInviteVerificationInfo, next) {
  next({
    ...vueRoutes.signup,
    params: { inviteVerificationInfo: decodedInviteVerificationInfo },
  })
}
