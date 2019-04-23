import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { types } from './types'

const state = {
  formData: {
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
      country: '', // // { code, translation }
      postalCode: '',
    },
    documents: {
      idDocumentType: {}, // { value, translationId }

      avatar: null,
      selfie: null,
      idDocumentFace: null,
      idDocumentBack: null,
    },
  },
}

const mutations = {
  // personal
  [types.SET_FIRST_NAME] (state, firstName) {
    state.formData.personal.firstName = firstName
  },
  [types.SET_LAST_NAME] (state, lastName) {
    state.formData.personal.lastName = lastName
  },
  [types.SET_DATE_OF_BIRTH] (state, dateOfBirth) {
    state.formData.personal.dateOfBirth = dateOfBirth
  },

  // address
  [types.SET_ADDRESS_LINE_1] (state, line1) {
    state.formData.address.line1 = line1
  },
  [types.SET_ADDRESS_LINE_2] (state, line2) {
    state.formData.address.line2 = line2
  },
  [types.SET_ADDRESS_CITY] (state, city) {
    state.formData.address.city = city
  },
  [types.SET_ADDRESS_COUNTRY] (state, country) {
    state.formData.address.country = country
  },
  [types.SET_ADDRESS_STATE] (state, s) {
    state.formData.address.state = s
  },
  [types.SET_ADDRESS_POSTAL_CODE] (state, code) {
    state.formData.address.postalCode = code
  },

  // document fields
  [types.SET_ID_DOCUMENT_TYPE] (state, type) {
    state.formData.documents.idDocumentType = type
  },

  // documents
  [types.SET_DOCUMENT_AVATAR] (state, doc) {
    state.formData.documents.avatar = doc
  },
  [types.SET_DOCUMENT_SELFIE] (state, doc) {
    state.formData.documents.selfie = doc
  },
  [types.SET_DOCUMENT_ID_DOC_FACE] (state, doc) {
    state.formData.documents.idDocument.face = doc
  },
  [types.SET_DOCUMENT_ID_DOC_BACK] (state, doc) {
    state.formData.documents.idDocument.back = doc
  },
}

const actions = {}

const getters = {
  [types.blobData]: (state) => {
    const formData = state.formData

    const blobData = {
      first_name: formData.personal.firstName,
      last_name: formData.personal.lastName,
      date_of_birth: formData.personal.dateOfBirth,
      address: {
        line_1: formData.address.line1,
        line_2: formData.address.line2,
        city: formData.address.city,
        country: formData.address.country.code,
        state: formData.address.state,
        postal_code: formData.address.postalCode,
      },
      documents: {
        [DOCUMENT_TYPES.kycIdDocument]: {
          type: formData.documents.idDocumentType.value,
          face: formData.documents.idDocumentFace.getDetailsForSave(),
        },
        [DOCUMENT_TYPES.kycSelfie]:
          formData.documents.selfie.getDetailsForSave(),
      },
    }

    // avatar is not required, it may not exist in old kyc data
    if (formData.documents.avatar) {
      blobData.documents[DOCUMENT_TYPES.kycAvatar] =
        formData.documents.avatar.getDetailsForSave()
    }

    // back side of documents is required only for specific document types
    if (formData.documents.idDocument.back) {
      blobData.documents[DOCUMENT_TYPES.kycIdDocument].back =
        formData.documents.idDocument.back.getDetailsForSave()
    }

    return blobData
  },
}

export const VerificationGeneralModule = {
  name: 'verification-general-form',
  namespaced: true,
  mutations,
  actions,
  getters,
  state,
}
