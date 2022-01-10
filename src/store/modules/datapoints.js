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
    console.log('aov...', payload)
    axios({
      method: 'post',
      url: `${process.env.VUE_APP_API_URL}/api/aov`,
      data: {
        from_domain: payload,
      },
    })
      .then((aov) => {
        console.log('aov result', aov)
        let aovResult
        if (aov.data == '') {
          commit('SET_AOV', 'coming soon')
        } else {
          commit('SET_AOV', aov.data.aov_value.toFixed(2))
        }
      })
      .catch((err) => {})
  },
  setBalance({ commit }, aovResult) {
    commit('SET_AOV', aovResult)
  },
}
