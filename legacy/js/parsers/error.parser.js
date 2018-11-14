import { ErrorFactory } from '../errors/factory'
import get from 'lodash/get'

const expiredSignatureStr = 'expired signature'

export function parseError (error) {
  const additionalParams = {}

  if (error.repeatDetails) {
    additionalParams.repeatDetails = error.repeatDetails
  }

  let body
  const rawBody = error.response ? error.response.data : error.body
  try {
    body = JSON.parse(rawBody)
  } catch (e) {
    if (rawBody && rawBody.errors) {
      body = rawBody
    } else {
      return parseSingleError({ ...error, ...additionalParams })
    }
  }
  const errors = body.errors
  const parsedErrors = errors.map(error =>
    parseSingleError({ ...error, ...additionalParams })
  )
  if (parsedErrors.length === 0) return parsedErrors[0]
  // TODO: need deal somehow with multiple errors:
  if (parsedErrors.length > 0) return parsedErrors[0]
}

function parseSingleError (error) {
  if (!error || (!error.status && !error.response)) {
    return ErrorFactory.getServerError()
  }
  const status = +error.status || +error.response.status
  switch (status) {
    case 400:
      return parseBadRequestError(error)
    case 403:
      return parseTfaError(error)
    case 502:
      return parseServerError(error)
    case 404:
      return parseNotFoundError(error)
    case 409:
      return parseConfictError()
    default:
      return ErrorFactory.getDefaultError(error)
  }
}

function parseTfaError (error) {
  const factorId = error.meta && error.meta.factor_id
  const token = error.meta && error.meta.token
  const keychainData = error.meta && error.meta.keychain_data
  const salt = error.meta && error.meta.salt
  const repeatDetails = error.repeatDetails
  const code = error.code
  if (keychainData) {
    return ErrorFactory.getPasswordFactorError(
      factorId,
      token,
      keychainData,
      salt,
      repeatDetails
    )
  } else if (factorId && token) {
    return ErrorFactory.getOtpError({ factorId, token, repeatDetails })
  } else if (code === 'verification_required') {
    return ErrorFactory.getEmailNotVerifiedError()
  } else return ErrorFactory.getDefaultError()
}

function parseServerError () {
  return ErrorFactory.getServerError()
}

function parseNotFoundError () {
  return ErrorFactory.getNotFoundError()
}

function parseConfictError () {
  return ErrorFactory.getConflictError()
}

function parseBadRequestError (error) {
  const { message, code } = getTransactionError(error)
  if (message) {
    return ErrorFactory.getTransactionError(message, code)
  }
  if (error.meta && error.meta.field === 'data/attributes/otp') {
    return ErrorFactory.getTFAWrongCodeError()
  } else if (get(error, 'body.extras.reason') === expiredSignatureStr) {
    return ErrorFactory.getExpiredSignatureError()
  } else {
    return ErrorFactory.getDefaultError()
  }
}

function getTransactionError (error) {
  const details = error.response && error.response.data
  const opCodes = get(details, 'extras.result_codes.operations', [])
  const txMessages = get(details, 'extras.result_codes.messages', [])
  if (!opCodes.length) return {}
  if (opCodes.length !== txMessages.length) {
    return {
      code: opCodes[0],
      message: txMessages[0]
    }
  }
  if (opCodes.length === 1) {
    return {
      opCode: opCodes[0],
      message: txMessages[0]
    }
  }
  return deriveCorrectTxError(opCodes, txMessages)
}

function deriveCorrectTxError (opCodes, txMessages) {
  let correctError = {}
  opCodes.forEach((code, i) => {
    if (code !== 'op_success') {
      correctError.code = code
      correctError.message = txMessages[i]
    }
  })
  return correctError
}
