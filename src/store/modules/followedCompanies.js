export const namespaced = true // ie user/[action]

export const state = {
  followedCompanies: [],
}

export const mutations = {
  PUSH(state, company) {
    state.followedCompanies.push({
      ...company,
      id: company.id,
    })
  },
  BULK_PUSH(state, companies) {
    state.followedCompanies = companies
  },
  REMOVE(state, companyToRemove) {
    state.followedCompanies = state.followedCompanies.filter(
      (company) => company.id !== companyToRemove.id
    )
  },
  REMOVE_ALL(state) {
    state.followedCompanies = []
  },
}

export const actions = {
  addAllFollowedCompanies({ commit }, companies) {
    commit('BULK_PUSH', companies)
  },
  addFollowedCompany({ commit }, company) {
    commit('PUSH', company)
  },
  removeFollowedCompany({ commit }, company) {
    commit('REMOVE', company)
  },
  // clearCompanySelection({ commit }) {
  //   commit('REMOVE_ALL')
  // },
}

export const getters = {
  userFollowsCompany: (state) => (id) => {
    return state.followedCompanies.find((company) => company.id === id)
  },
  userFollowedCompanies: (state) => {
    return state.followedCompanies
  },
}
