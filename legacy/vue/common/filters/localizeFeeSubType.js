import { translate } from './translate'

const SUBTYPE_TYPE = {
  0: translate('fees_incoming_outgoing'),
  1: translate('fees_outgoing'),
  2: translate('fees_incoming')
}

export function localizeFeeSubType (type) {
  return SUBTYPE_TYPE[type + '']
}
