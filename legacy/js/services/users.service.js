import { Service } from './service'
import { errors } from '../errors/factory'

export class UsersService extends Service {
  /**
   * Creates user with specified account id
   *
   * @param {string} accountId
   * @param {number} [type]
   * @return {ResponseBuilder}
   */
  createUser (accountId = this._accountId, type = 1) {
    const attributes = { type }

    return this._apiRequestBuilder.users()
      .accountId(accountId)
      .attributes(attributes)
      .sign(this._keypair)
      .json()
      .put()
  }

  /**
   * Load user details for specified account id
   *
   * @param {string} accountId
   * @return {ResponseBuilder}
   */
  loadUser (accountId = this._accountId) {
    return this._apiRequestBuilder.users()
      .accountId(accountId)
      .sign(this._keypair)
      .get()
  }

  /**
   * Checks if user with current account id exists
   */
  checkIfUserExists () {
    return this.loadUser()
      // eslint-disable-next-line promise/prefer-await-to-then
      .then(_ => true)
      .catch(error =>
        error instanceof errors.NotFoundError
          ? false
          : Promise.reject(error)
      )
  }

  /**
   * Changes user type to provided. Note: this works only if user have no
   * specified type before
   *
   * @param {string} type, 'general' - for individual users,
   * 'syndicate' - for corporations
   *
   */
  patchUserType (type) {
    const data = { type }

    return this._apiRequestBuilder.users()
      .accountId(this._accountId)
      .data(data)
      .sign(this._keypair)
      .json()
      .patch()
  }

  patchUserAirdropState (state) {
    const attributes = { airdrop_state: state }

    return this._apiRequestBuilder.users()
      .accountId(this._accountId)
      .attributes(attributes)
      .sign(this._keypair)
      .json()
      .patch()
  }

  /**
   * Changes user details to provided. Note: user type will be changed only if
   * user have no specified type before
   *
   * @param {string} type, 'general' - for individual users, 'syndicate' - for
   *        corporations
   * @param {string} state, ('waiting_for_approval' is the only one needed in
   *        most cases)
   * @param {number} sequence - sequence of KYC blob, you should increment it
   *        every time user changes his KYC
   *
   */
  patchUserDetails (type, state, sequence) {
    const data = { type }
    const attributes = { state, kyc_sequence: sequence }

    return this._apiRequestBuilder.users()
      .accountId(this._accountId)
      .data(data)
      .attributes(attributes)
      .sign(this._keypair)
      .json()
      .patch()
  }

  loadUserFavorites () {
    return this._apiRequestBuilder.users()
      .accountId(this._accountId)
      .favorites()
      .sign()
      .json()
      .get()
  }

  addUserFavorite (type, key) {
    return this._apiRequestBuilder.users()
      .accountId(this._accountId)
      .favorites()
      .data({ type })
      .attributes({ key })
      .sign()
      .json()
      .post()
  }

  deleteUserFavorite (favoriteId) {
    return this._apiRequestBuilder.users()
      .accountId(this._accountId)
      .favorites()
      .favoriteId(favoriteId)
      .sign()
      .json()
      .delete()
  }

  /**
   * Operate over blobs of specific user
   * @param {string} [owner] address of the user whose blobs you want operate
   * @returns {Object} An object with possible operations
   */
  blobsOf (owner = this._accountId) {
    const _this = this
    const blank = this._apiRequestBuilder.users()
      .accountId(owner)
      .blobs()

    return {
      /**
       * Get blobs. All the blobs. You want many blobs, you know?
       * You may pass some filters, if you want.
       * @param {Object} filters
       * @returns {Promise}
       */
      getAll (filters) {
        for (const key in filters) {
          if (filters.hasOwnProperty(key)) {
            const element = filters[key]
            blank.addQuery(key, element)
          }
        }

        return blank
          .sign(_this._keypair)
          .get()
          // eslint-disable-next-line promise/prefer-await-to-then
          .then(res => res.attributes().map(attr => JSON.parse(attr.value)))
      },

      /**
       * Get blob by id
       * @param {string} id ID of the blob to get
       * @returns {Promise}
       */
      get (id) {
        return blank
          .blobID(id)
          .sign(_this._keypair)
          .get()
          // eslint-disable-next-line promise/prefer-await-to-then
          .then(res => JSON.parse(res.attribute('value')))
      },

      /**
       * Creates a blob on API
       * @param {string} type Type of the blob
       * @param {object} value Value of the blob. Will be stringified
       * @param {object} [relationships] Will be used as filters on getting
       * @returns {Promise}
       */
      create (type, value, relationships) {
        blank.data({ type })
          .attributes({ value: JSON.stringify(value) })

        if (Object.keys(relationships || {}).length) {
          const res = {}
          for (const key in relationships) {
            if (relationships.hasOwnProperty(key)) {
              const value = relationships[key]
              res[key] = { data: { id: value } }
            }
          }
          blank.relationships(res)
        }

        return blank
          .sign(_this._keypair)
          .json()
          .post()
      }
    }
  }

  uploadBlob (type, value) {
    return this._apiRequestBuilder.users()
      .accountId(this._accountId)
      .blobs()
      .data({ type })
      .attributes({ value })
      .sign()
      .json()
      .post()
  }

  /**
   * WORK IN PROGRESS. Loads user KYC entities
   */
  getKYCEntities () {
    return this._apiRequestBuilder.users()
      .accountId(this._accountId)
      .entities()
      .sign(this._keypair)
      .get()
  }

  /**
   * WORK IN PROGRESS. Creates user KYC entity
   */
  createKYCEntity (type, details) {
    return this._apiRequestBuilder.users()
      .accountId(this._accountId)
      .entities()
      .data({ type })
      .attributes(details)
      .sign(this._keypair)
      .json()
      .post()
  }

  /**
   * WORK IN PROGRESS. Updates user KYC entity
   */
  updateKYCEntity (entityID, type, details) {
    return this._apiRequestBuilder.users()
      .accountId(this._accountId)
      .entities()
      .entityID(entityID)
      .data({ type })
      .attributes(details)
      .sign(this._keypair)
      .json()
      .put()
  }

  loadEnums () {
    return this._apiRequestBuilder
      .commonData()
      .enums()
      .sign(this._keypair)
      .get()
  }
}

export const usersService = new UsersService()
