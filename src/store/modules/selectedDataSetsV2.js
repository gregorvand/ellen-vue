export const namespaced = true // ie user/[action]
export const state = () => ({
  currentActiveDataSet: [],
  currentYear: '2021',
})

export const getters = {
  currentActiveDataSets(state) {
    return state.currentActiveDataSets
  },
  currentDataYear(state) {
    return state.currentYear
  },
}

export const mutations = {
  PUSH_DATASET(state, dataset) {
    const datasets = state.currentActiveDataSet
    if (datasets.length > 0) {
      datasets.shift()
      datasets.push(dataset)
    } else {
      datasets.push(dataset)
    }
  },
  UPDATE_YEAR(state, year) {
    state.currentYear = year
  },
}

export const actions = {
  async getAndStoreDataSet({ commit }, payload) {
    commit('PUSH_DATASET', payload)
  },
  async updateSelectedYear({ commit }, payload) {
    commit('UPDATE_YEAR', payload)
  },
}
