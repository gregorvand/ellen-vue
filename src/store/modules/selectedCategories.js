// import CategoryService from '@/services/CategoryService.js'

export const namespaced = true // ie user/[action]

export const state = () => ({
  selectedCategories: [],
})

export const mutations = {
  PUSH(state, category) {
    state.selectedCategories.push({
      ...category,
      id: category.id,
    })
  },
  REMOVE(state, companyToRemove) {
    state.selectedCategories = state.selectedCategories.filter(
      (company) => company.id !== companyToRemove.id
    )
  },
  REMOVE_ALL(state) {
    state.selectedCategories = []
  },
}

export const actions = {
  addCategoryToSelection({ commit }, category) {
    commit('PUSH', category)
  },
  removeCategorySelection({ commit }, category) {
    commit('REMOVE', category)
  },
  clearCategorySelection({ commit }) {
    commit('REMOVE_ALL')
  },
}

export const getters = {
  userHasCategory: (state) => (category) => {
    return state.selectedCategories.find((category) => category.id === id)
  },
  userCategories: (state) => {
    return state.selectedCategories
  },
}
