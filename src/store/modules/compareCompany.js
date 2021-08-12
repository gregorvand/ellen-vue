export const namespaced = true // ie user/[action]

export const state = {
  compareCompany: [],
}

export const getters = {
  getterValue: (state) => {
    return state.value
  },
}

export const mutations = {
  SET(state, company) {
    state.compareCompany = [
      {
        ...company,
        id: company.id,
      },
    ]
  },
  CLEAR(state) {
    state.compareCompany = []
  },
}

export const actions = {
  updateCompare({ commit }, company) {
    commit('SET', company)
  },
  clearCompare({ commit }) {
    commit('CLEAR')
  },
}
