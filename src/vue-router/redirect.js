import { vueRoutes } from './routes'

const REDIRECT_TYPES = {
  email: 1,
}

export const resolveRedirect = (to, from, next) => {
  const encodedValue = to.path.replace('/r/', '')
  const action = JSON.parse(atob(encodedValue))

  switch (action.type) {
    case REDIRECT_TYPES.email:
      handleEmailRedirect(encodedValue, next)
      break
  }
}

function handleEmailRedirect (encodedVerificationCode, next) {
  next({
    ...vueRoutes.login,
    params: { encodedVerificationCode },
  })
}
