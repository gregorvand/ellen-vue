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
      method: 'post',
      url: `${process.env.VUE_APP_API_URL}/api/aov`,
      data: {
        from_domain: payload,
      },
    })
      .then((aov) => {
        let aovResult
        if (aov.data == '') {
          commit('SET_AOV', 'coming soon')
        } else {
          commit('SET_AOV', aov.data)
        }
      })
      .catch((err) => {
        commit('SET_AOV', { message: 'Puchase data to unlock AOV' })
      })
  },
  setBalance({ commit }, aovResult) {
    commit('SET_AOV', aovResult)
  },
}
