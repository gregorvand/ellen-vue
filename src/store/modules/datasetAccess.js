export const namespaced = true // ie user/[action]
export const state = () => ({
  accessIDsByCompany: [],
})

export const getters = {
  currentAccess(state) {
    return state.accessIDsByCompany
  },
}

export const mutations = {
  PUSH_ACCESS(state, dataset) {
    state.accessIDsByCompany.push(dataset)
  },
}

export const actions = {
  async storeDatasetAccess({ commit, state }, payload) {
    let accessIds = payload.data.map((datasetAccess) => {
      return datasetAccess.datasetId
    })
    const accessObject = {
      companyId: payload.data[0]?.emailIdentifier,
      datasetIds: accessIds,
    }
    commit('PUSH_ACCESS', accessObject)
  },
}
