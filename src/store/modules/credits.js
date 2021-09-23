import axios from 'axios'

export const namespaced = true

export const state = () => ({
  displayCreditBalance: false,
})

export const getters = {
  currentCredits: (state) => {
    return state.displayCreditBalance
  },
}

export const mutations = {
  SET_BALANCE(state, credits) {
    state.displayCreditBalance = credits
  },
}

export const actions = {
  fetchBalance({ commit }) {
    axios
      .get(`${process.env.VUE_APP_API_URL}/api/user/credit-balance`)
      .then((balance) => {
        commit('SET_BALANCE', parseInt(balance?.data[0]?.credit_balance || 0))
      })
      .catch((err) => {})
  },
  setBalance({ commit }, balance) {
    commit('SET_BALANCE', balance)
  },
}
