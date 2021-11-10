export const namespaced = true // ie user/[action]
export const state = () => ({
  currentActiveDataSet: [],
})

export const getters = {
  currentActiveDataSets(state) {
    return state.currentActiveDataSets
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
}

export const actions = {
  async getAndStoreDataSet({ commit, state }, payload) {
    commit('PUSH_DATASET', payload)
  },
}
