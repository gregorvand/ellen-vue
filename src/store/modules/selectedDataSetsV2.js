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
    state.currentActiveDataSet.push(dataset)
  },
}

export const actions = {
  async getAndStoreDataSet({ commit, state }, payload) {
    commit('PUSH_DATASET', payload)
  },
}
