import { DOCUMENT_TYPES } from '@/js/const/document-types.const'
import { COUNTRIES } from '../countries'
import { types } from './types'
import { DocumentContainer } from '@/js/helpers/DocumentContainer'

const state = {
  form: {
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
    state.form.personal.firstName = firstName
  },
  [types.SET_LAST_NAME] (state, lastName) {
    state.form.personal.lastName = lastName
  },
  [types.SET_DATE_OF_BIRTH] (state, dateOfBirth) {
    state.form.personal.dateOfBirth = dateOfBirth
  },

  // address
  [types.SET_LINE_1] (state, line1) {
    state.form.address.line1 = line1
  },
  [types.SET_LINE_2] (state, line2) {
    state.form.address.line2 = line2
  },
  [types.SET_CITY] (state, city) {
    state.form.address.city = city
  },
  [types.SET_COUNTRY] (state, country) {
    state.form.address.country = country
  },
  [types.SET_STATE] (state, s) {
    state.form.address.state = s
  },
  [types.SET_POSTAL_CODE] (state, code) {
    state.form.address.postalCode = code
  },

  // document fields
  [types.SET_ID_DOCUMENT_TYPE] (state, type) {
    state.form.documents.idDocumentType = type
  },

  // documents
  [types.SET_AVATAR] (state, doc) {
    state.form.documents.avatar = doc
  },
  [types.SET_SELFIE] (state, doc) {
    state.form.documents.selfie = doc
  },
  [types.SET_ID_DOCUMENT_FACE] (state, doc) {
    state.form.documents.idDocument.face = doc
  },
  [types.SET_ID_DOCUMENT_BACK] (state, doc) {
    state.form.documents.idDocument.back = doc
  },
}

const actions = {
  [types.POPULATE_FORM] ({ commit }, blobData) {
    commit(types.SET_FIRST_NAME, blobData.first_name)
    commit(types.SET_LAST_NAME, blobData.last_name)
    commit(types.SET_DATE_OF_BIRTH, blobData.date_of_birth)

    commit(types.SET_LINE_1, blobData.address.line_1)
    commit(types.SET_LINE_2, blobData.address.line_2)
    commit(types.SET_CITY, blobData.address.city)
    commit(types.SET_COUNTRY, {
      code: blobData.address.country,
      translation: COUNTRIES[blobData.address.country],
    })
    commit(types.SET_STATE, blobData.address.state)
    commit(types.SET_POSTAL_CODE, blobData.address.postal_code)

    commit(types.SET_SELFIE, new DocumentContainer(
      blobData.documents[DOCUMENT_TYPES.kycSelfie]
    ))

    const idDocument = blobData.documents[DOCUMENT_TYPES.kycIdDocument]

    commit(types.SET_ID_DOCUMENT_TYPE, new DocumentContainer(idDocument.type))
    commit(types.SET_ID_DOCUMENT_FACE,
      new DocumentContainer(idDocument.face)
    )
    if (idDocument.back) {
      commit(types.SET_ID_DOCUMENT_BACK,
        new DocumentContainer(idDocument.back)
      )
    }

    if (blobData.documents[DOCUMENT_TYPES.kycAvatar]) {
      commit(types.SET_AVATAR, new DocumentContainer(
        blobData.documents[DOCUMENT_TYPES.kycAvatar]
      ))
    }
  },
}

const getters = {
  [types.blobData]: (state) => {
    const form = state.form

    const blobData = {
      first_name: form.personal.firstName,
      last_name: form.personal.lastName,
      date_of_birth: form.personal.dateOfBirth,
      address: {
        line_1: form.address.line1,
        line_2: form.address.line2,
        city: form.address.city,
        country: form.address.country.code,
        state: form.address.state,
        postal_code: form.address.postalCode,
      },
      documents: {
        [DOCUMENT_TYPES.kycIdDocument]: {
          type: form.documents.idDocumentType.value,
        },
      },
    }

    if (form.documents.idDocumentFace) {
      blobData.documents[DOCUMENT_TYPES.kycIdDocument].face =
        form.documents.idDocumentFace.getDetailsForSave()
    }

    if (form.documents.selfie) {
      blobData.documents[DOCUMENT_TYPES.kycSelfie] =
        form.documents.selfie.getDetailsForSave()
    }

    // avatar is not required, it may not exist in old kyc data
    if (form.documents.avatar) {
      blobData.documents[DOCUMENT_TYPES.kycAvatar] =
        form.documents.avatar.getDetailsForSave()
    }

    // back side of documents is required only for specific document types
    if (form.documents.idDocumentBack) {
      blobData.documents[DOCUMENT_TYPES.kycIdDocument].back =
        form.documents.idDocumentBack.getDetailsForSave()
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
