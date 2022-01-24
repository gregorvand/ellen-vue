import axios from 'axios'

export const namespaced = true

export const state = () => ({
  aov: 'loading',
  act: 'loading',
})

export const getters = {
  currentPeriodAov: (state) => {
    return state.act
  },
}

export const mutations = {
  SET_AOV(state, aov) {
    state.aov = aov
  },
  SET_ACT(state, act) {
    state.act = act
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
  fetchAct({ commit }, payload) {
    console.log(payload)
    axios({
      method: 'post',
      url: `${process.env.VUE_APP_API_URL}/api/act`,
      data: {
        from_domain: payload,
      },
    })
      .then((act) => {
        if (act.data == '') {
          commit('SET_ACT', 'coming soon')
        } else {
          commit('SET_ACT', act.data)
        }
      })
      .catch((err) => {
        commit('SET_ACT', {
          message: 'Puchase data to unlock Avg. Customer Orders',
        })
      })
  },
}
