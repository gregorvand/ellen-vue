export const namespaced = true // ie user/[action]

export const state = () => ({
  payment_modal: 'closed',
})

export const getters = {
  getterPaymentModal: (state) => {
    return state.value
  },
}

export const mutations = {
  SET_PAYMENT_MODAL: (state, payload) => {
    state.payment_modal = payload
  },
}

export const actions = {
  togglePaymentModal({ commit }, payload) {
    commit('SET_PAYMENT_MODAL', payload)
  },
}
