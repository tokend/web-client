import { vuexTypes } from '../types'
import { usersService } from '../../js/services/users.service'
import get from 'lodash/get'

export const state = {
  email: '',
  createdAt: '',
  details: {
    favorites: []
  }
}

export const mutations = {
  SET_USER_EMAIL (state, email) {
    state.email = email
  },
  SET_USER_CREATED_AT (state, createdAt) {
    state.createdAt = createdAt
  },
  SET_FAVORITES: (state, favorites) => {
    state.details.favorites = favorites
  }
}

export const actions = {
  async GET_USER_DETAILS ({ commit }) {
    const userDetails = await usersService.loadUser()

    commit(vuexTypes.SET_USER_EMAIL, userDetails.attribute('email'))
    commit(vuexTypes.SET_USER_CREATED_AT, userDetails.attribute('created_at'))
  },

  async GET_USER_FAVORITES ({ commit }) {
    const response = await usersService.loadUserFavorites()
    const favorites = response
      .data()
      .map(item => ({ id: get(item, 'data.id'), key: get(item, 'data.attributes.key') }))
    commit(vuexTypes.SET_FAVORITES, favorites)
  }
}

export const getters = {
  userEmail: state => state.email,
  userType: state => state.type,
  userCreatedAt: state => state.createdAt,
  userFavorites: state => state.details.favorites
}

export default {
  actions,
  getters,
  mutations,
  state
}
