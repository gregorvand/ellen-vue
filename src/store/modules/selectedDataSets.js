export const namespaced = true // ie user/[action]

export const state = () => ({
  companyId: 0,
  selectedDates: [],
  currentDataSets: [],
})

export const getters = {
  userHasSelectedDates: (state) => (id) => {
    return state.selectedDates.find((date) => date.id === id)
  },
}

export const mutations = {
  PUSH(state, dataset) {
    state.selectedDates.push(dataset)
  },
  REMOVE(state, dateToRemove) {
    state.selectedDates = state.selectedDates.filter(
      (date) => date.id !== dateToRemove.id
    )
    localStorage.setItem(
      'selectedCompanies',
      JSON.stringify(state.selectedCompanies)
    )
  },
}

export const actions = {
  addDateToSelection({ commit }, date) {
    commit('PUSH', date)
  },
  removeDateSelection({ commit }, date) {
    commit('REMOVE', date)
  },
}
