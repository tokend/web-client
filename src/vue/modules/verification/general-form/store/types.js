const mutations = {
  SET_IS_ACCREDITED: 'SET_IS_ACCREDITED',

  SET_FIRST_NAME: 'SET_FIRST_NAME',
  SET_LAST_NAME: 'SET_LAST_NAME',
  SET_DATE_OF_BIRTH: 'SET_DATE_OF_BIRTH',

  SET_LINE_1: 'SET_LINE_1',
  SET_LINE_2: 'SET_LINE_2',
  SET_CITY: 'SET_CITY',
  SET_COUNTRY: 'SET_COUNTRY',
  SET_STATE: 'SET_STATE',
  SET_POSTAL_CODE: 'SET_POSTAL_CODE',

  SET_ID_DOCUMENT_TYPE: 'SET_ID_DOCUMENT_TYPE',

  SET_AVATAR: 'SET_AVATAR',
  SET_SELFIE: 'SET_SELFIE',
  SET_ID_DOCUMENT_FACE: 'SET_ID_DOCUMENT_FACE',
  SET_ID_DOCUMENT_BACK: 'SET_ID_DOCUMENT_BACK',
  SET_PROOF_OF_INVESTOR: 'SET_PROOF_OF_INVESTOR',
}

const actions = {
  GET_BLOB_DATA: 'GET_BLOB_DATA',
  POPULATE_STATE: 'POPULATE_STATE',
  UPLOAD_DOCUMENTS: 'UPLOAD_DOCUMENTS',
  CREATE_BLOB: 'CREATE_BLOB',
  SUBMIT_REQUEST_OP: 'SUBMIT_REQUEST_OP',
}

const getters = {
  firstName: 'firstName',
  lastName: 'lastName',
  dateOfBirth: 'dateOfBirth',

  line1: 'line1',
  line2: 'line2',
  city: 'city',
  country: 'country',
  state: 'state',
  postalCode: 'postalCode',
  countryCode: 'countryCode',

  idDocumentType: 'idDocumentType',
  avatar: 'avatar',
  selfie: 'selfie',
  idDocumentFace: 'idDocumentFace',
  idDocumentBack: 'idDocumentBack',
  proofOfInvestor: 'proofOfInvestor',

  isAccredited: 'isAccredited',

  blobData: 'blobData',
}

export const types = {
  ...actions,
  ...getters,
  ...mutations,
}
