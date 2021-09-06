export const namespaced = true // ie user/[action]
import dayjs from 'dayjs'
import axios from 'axios'

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
  PUSH_DATE(state, date) {
    state.selectedDates.push(date)
  },
  REMOVE_DATE(state, dateToRemove) {
    state.selectedDates = state.selectedDates.filter(
      (date) => date.id !== dateToRemove.id
    )
    localStorage.setItem(
      'selectedCompanies',
      JSON.stringify(state.selectedCompanies)
    )
  },

  PUSH_DATASET(state, dataset) {
    state.currentDataSets.push(dataset)
  },
}

export const actions = {
  addDateToSelection({ commit, dispatch }, date) {
    commit('PUSH_DATE', date)
    dispatch('getAndStoreDataSet', { ...date })
    // trigger same DataSet to be retrieved and added
  },
  removeDateSelection({ commit }, date) {
    commit('REMOVE_DATE', date)
    //  trigger DataSet to be deactivated
    // avoid extra API calls by keeping in store but deactivating
  },

  async getAndStoreDataSet({ commit }, date) {
    // Push to dataset
    // generate Start and end date
    const date1 = date.date
    const date2 = dayjs(date1).endOf('month').toISOString()
    console.log(date1, date2)

    // API call for dataset
    const dataset = await getDataPoints(22055, date1, date2)

    commit('PUSH_DATASET', dataset)
  },
}

async function getDataPoints(companyId, startDate, endDate) {
  return axios({
    method: 'post',
    url: `${process.env.VUE_APP_API_URL}/api/companies/orders-by-month`,
    data: {
      companyId: companyId,
      dateStart: startDate,
      dateEnd: endDate,
    },
  })
}
