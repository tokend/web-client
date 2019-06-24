import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { ID_DOCUMENT_TYPES } from '../id-document-types'
import { COUNTRIES } from '../countries'
import { types } from './types'

import { wrapDocument } from './wrap-document'

import { toRFC3339, fromRFC3339 } from '../format-date'
import { uploadDocument } from '@/js/helpers/upload-documents'

const state = {
  isAccredited: false,
  personal: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  },
  address: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    country: '', // { code, translation }
    postalCode: '',
  },
  documents: {
    idDocumentType: '', // { value, translationId }

    selfie: null,
    idDocumentFace: null,
    idDocumentBack: null,
    proofOfInvestor: null,
  },
}

const mutations = {
  [types.SET_IS_ACCREDITED] (state, isAccredited) {
    state.isAccredited = isAccredited
  },
  // personal
  [types.SET_FIRST_NAME] (state, firstName) {
    state.personal.firstName = firstName
  },
  [types.SET_LAST_NAME] (state, lastName) {
    state.personal.lastName = lastName
  },
  [types.SET_DATE_OF_BIRTH] (state, dateOfBirth) {
    state.personal.dateOfBirth = dateOfBirth
  },

  // address
  [types.SET_LINE_1] (state, line1) {
    state.address.line1 = line1
  },
  [types.SET_LINE_2] (state, line2) {
    state.address.line2 = line2
  },
  [types.SET_CITY] (state, city) {
    state.address.city = city
  },
  [types.SET_COUNTRY] (state, country) {
    state.address.country = country
  },
  [types.SET_STATE] (state, s) {
    state.address.state = s
  },
  [types.SET_POSTAL_CODE] (state, code) {
    state.address.postalCode = code
  },

  // document fields
  [types.SET_ID_DOCUMENT_TYPE] (state, type) {
    state.documents.idDocumentType = type
  },

  // documents
  [types.SET_SELFIE] (state, doc) {
    state.documents.selfie = doc
  },
  [types.SET_ID_DOCUMENT_FACE] (state, doc) {
    state.documents.idDocumentFace = doc
  },
  [types.SET_ID_DOCUMENT_BACK] (state, doc) {
    state.documents.idDocumentBack = doc
  },
  [types.SET_PROOF_OF_INVESTOR] (state, doc) {
    state.documents.proofOfInvestor = doc
  },
}

const actions = {
  [types.POPULATE_STATE] ({ commit }, requestData) {
    commit(types.SET_FIRST_NAME, requestData.first_name)
    commit(types.SET_LAST_NAME, requestData.last_name)
    commit(types.SET_DATE_OF_BIRTH, fromRFC3339(requestData.date_of_birth))

    commit(types.SET_LINE_1, requestData.address.line_1)
    commit(types.SET_LINE_2, requestData.address.line_2)
    commit(types.SET_CITY, requestData.address.city)
    commit(types.SET_COUNTRY,
      COUNTRIES.find(c => c.code === requestData.address.country)
    )
    commit(types.SET_STATE, requestData.address.state)
    commit(types.SET_POSTAL_CODE, requestData.address.postal_code)

    commit(types.SET_SELFIE, wrapDocument(
      requestData.documents[DOCUMENT_TYPES.kycSelfie],
      DOCUMENT_TYPES.kycSelfie,
    ))

    const idDocument = requestData.documents[DOCUMENT_TYPES.kycIdDocument]

    commit(types.SET_ID_DOCUMENT_TYPE,
      ID_DOCUMENT_TYPES.find(t => t.value === idDocument.type)
    )
    commit(types.SET_ID_DOCUMENT_FACE, wrapDocument(
      idDocument.face, DOCUMENT_TYPES.kycIdDocument
    ))

    if (idDocument.back) {
      commit(types.SET_ID_DOCUMENT_BACK, wrapDocument(
        idDocument.back, DOCUMENT_TYPES.kycIdDocument
      ))
    }

    if (requestData.documents[DOCUMENT_TYPES.kycAvatar]) {
      commit(types.SET_AVATAR, wrapDocument(
        requestData.documents[DOCUMENT_TYPES.kycAvatar],
        DOCUMENT_TYPES.kycAvatar,
      ))
    }

    if (requestData.documents[DOCUMENT_TYPES.kycProofOfInvestor]) {
      commit(types.SET_IS_ACCREDITED, true)
      commit(types.SET_PROOF_OF_INVESTOR, wrapDocument(
        requestData.documents[DOCUMENT_TYPES.kycProofOfInvestor],
        DOCUMENT_TYPES.kycProofOfInvestor,
      ))
    }
  },

  async [types.UPLOAD_DOCUMENTS] ({ state }) {
    await Promise.all([
      // it modifies the state intentionally
      uploadDocument(state.documents.selfie),
      uploadDocument(state.documents.idDocumentFace),
      uploadDocument(state.documents.idDocumentBack),
      uploadDocument(state.documents.proofOfInvestor),
    ])
  },
}

const getters = {
  [types.isAccredited]: state => state.isAccredited,

  // personal
  [types.firstName]: state => state.personal.firstName,
  [types.lastName]: state => state.personal.lastName,
  [types.dateOfBirth]: state => state.personal.dateOfBirth,

  // address
  [types.line1]: state => state.address.line1,
  [types.line2]: state => state.address.line2,
  [types.city]: state => state.address.city,
  [types.state]: state => state.address.state,
  [types.country]: state => state.address.country,
  [types.countryCode]: state => (state.address.country || {}).code,
  [types.postalCode]: state => state.address.postalCode,

  // documents
  [types.idDocumentType]: state => state.documents.idDocumentType,
  [types.selfie]: state => state.documents.selfie,
  [types.idDocumentFace]: state => state.documents.idDocumentFace,
  [types.idDocumentBack]: state => state.documents.idDocumentBack,
  [types.proofOfInvestor]: state => state.documents.proofOfInvestor,

  [types.requestData]: (_, getters) => {
    const requestData = {
      first_name: getters[types.firstName],
      last_name: getters[types.lastName],
      date_of_birth: toRFC3339(getters[types.dateOfBirth]),
      address: {
        line_1: getters[types.line1],
        line_2: getters[types.line2],
        city: getters[types.city],
        country: getters[types.countryCode],
        state: getters[types.state],
        postal_code: getters[types.postalCode],
      },
      documents: {
        [DOCUMENT_TYPES.kycIdDocument]: {
          type: state.documents.idDocumentType &&
            state.documents.idDocumentType.value,
        },
      },
    }

    if (state.isAccredited) {
      if (state.kycProofOfInvestor) {
        requestData.documents[DOCUMENT_TYPES.kycProofOfInvestor] =
          state.documents.proofOfInvestor.getDetailsForSave()
      }
    }

    if (state.documents.idDocumentFace) {
      requestData.documents[DOCUMENT_TYPES.kycIdDocument].face =
        state.documents.idDocumentFace.getDetailsForSave()
    }

    if (state.documents.selfie) {
      requestData.documents[DOCUMENT_TYPES.kycSelfie] =
        state.documents.selfie.getDetailsForSave()
    }

    // back side of documents is needed only for specific document types
    if (state.documents.idDocumentBack) {
      requestData.documents[DOCUMENT_TYPES.kycIdDocument].back =
        state.documents.idDocumentBack.getDetailsForSave()
    }

    // is required only when applying for accredited investor role
    if (state.documents.proofOfInvestor) { // TODO
      requestData.documents[DOCUMENT_TYPES.kycProofOfInvestor] =
        state.documents.proofOfInvestor.getDetailsForSave()
    }

    return requestData
  },
}

export const KycRecoveryGeneralModule = {
  name: 'kyc-recovery-general-form',
  namespaced: true,
  mutations,
  actions,
  getters,
  state,
}
