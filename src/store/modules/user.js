import axios from 'axios'

export const namespaced = true // ie user/[action]

export const state = () => ({
  user: null,
})

export const mutations = {
  SET_USER_DATA(state, userData) {
    state.user = userData
    localStorage.setItem('user', JSON.stringify(userData))
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`
  },
  LOGOUT() {
    localStorage.removeItem('user')
    localStorage.removeItem('companies')
    localStorage.removeItem('selectedCompanies')
    location.reload()
  },
}
export const actions = {
  register({ commit }, credentials) {
    return axios
      .post(`${process.env.VUE_APP_API_URL}/api/users`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(({ data }) => {
        commit('SET_USER_DATA', data)
      })
  },
  login({ commit }, credentials) {
    return axios
      .post(`${process.env.VUE_APP_API_URL}/api/login`, credentials)
      .then(({ data }) => {
        commit('SET_USER_DATA', data)
      })
  },
  logout({ commit }) {
    commit('LOGOUT')
  },
}

export const getters = {
  loggedIn(state) {
    return !!state.user
  },

  userObject(state) {
    return state.user
  },
}
