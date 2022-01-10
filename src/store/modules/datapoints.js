import axios from 'axios'

export const namespaced = true

export const state = () => ({
  aov: 'loading',
})

export const getters = {
  currentPeriodAov: (state) => {
    return state.aov
  },
}

export const mutations = {
  SET_AOV(state, aov) {
    state.aov = aov
  },
}

export const actions = {
  fetchAov({ commit }, payload) {
    axios({
      method: 'get',
      url: `${process.env.VUE_APP_API_URL}/api/aov`,
      data: {
        from_domain: payload,
      },
    })
      .then((aov) => {
        commit('SET_AOV', parseInt(aov.aov_value))
      })
      .catch((err) => {})
  },
  setBalance({ commit }, aov) {
    commit('SET_AOV', aov)
  },
}
