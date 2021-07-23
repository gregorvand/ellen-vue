import CategoryService from '@/services/CategoryService.js'

export const namespaced = true // ie user/[action]

export const state = () => ({
  currentList: [],
})

// export const getters = {
//   getterValue: (state) => {
//     return state.value
//   },
// }

export const mutations = {
  SET_CATEGORY_LIST(state, payload) {
    state.currentList = payload
  },
}

export const actions = {
  updateList({ commit }, payload) {
    commit('SET_CATEGORY_LIST', payload)
  },

  fetchCategories({ commit, dispatch }) {
    CategoryService.getCategories()
      .then((response) => {
        commit('SET_CATEGORY_LIST', response.data)
      })
      .catch((error) => {
        const notification = {
          type: 'error',
          message:
            'There was a problem fetching company categories: ' + error.message,
        }
        dispatch('notification/add', notification, { root: true })
      })
  },
}
