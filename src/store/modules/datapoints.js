import axios from 'axios'

export const namespaced = true

export const state = () => ({
  aov: 'loading',
  act: 'loading',
  tsi: 'loading',
})

export const mutations = {
  SET_AOV(state, aov) {
    state.aov = aov
  },
  SET_ACT(state, act) {
    state.act = act
  },
  SET_TSI(state, tsi) {
    state.tsi = tsi
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
  fetchTsi({ commit }, payload) {
    axios({
      method: 'post',
      url: `${process.env.VUE_APP_API_URL}/api/tsi`,
      data: {
        from_domain: payload,
      },
    })
      .then((tsi) => {
        commit('SET_TSI', tsi.data.tsi_list)
      })
      .catch((err) => {
        commit('SET_TSI', {
          message: 'Puchase data to unlock highest selling SKUs',
        })
      })
  },
}
