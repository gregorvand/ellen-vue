export const namespaced = true // ie user/[action]
import dayjs from 'dayjs'
import axios from 'axios'

export const state = () => ({
  currentDates: [],
  currentDataSets: [],
  selectedDateIDs: [],
})

export const getters = {
  userHasSelectedDates: (state) => (id) => {
    console.log(state.selectedDateIDs[0], id)
    return state.selectedDateIDs.find((selectedDates) => selectedDates === id)
  },
}

export const mutations = {
  PUSH_DATE(state, dateId) {
    state.selectedDateIDs.push(dateId)
  },
  REMOVE_DATE(state, dateToRemove) {
    state.selectedDates = state.currentDates.filter(
      (date) => date.id !== dateToRemove.id
    )
  },

  PUSH_DATASET(state, dataset) {
    state.currentDataSets.push(dataset)
  },
}

export const actions = {
  addDateToSelection({ commit, dispatch }, { date, company, id }) {
    console.log(company, id)
    commit('PUSH_DATE', id)
    dispatch('getAndStoreDataSet', { ...date, company, id })
    // trigger same DataSet to be retrieved and added
  },
  removeDateSelection({ commit }, date) {
    commit('REMOVE_DATE', date)
    //  trigger DataSet to be deactivated
    // avoid extra API calls by keeping in store but deactivating
  },

  async getAndStoreDataSet({ commit }, { date, company, dateId }) {
    // Push to dataset
    // generate Start and end date
    console.log(date, company, dateId)
    const date1 = date
    const date2 = dayjs(date1).endOf('month').toISOString()

    // API call for dataset
    const dataset = await getDataPoints(company, date1, date2)
    const plotData = dataset.data
    const dataMonth = plotData[plotData.length - 1].x

    const chartDataObject = {
      label: dayjs(dataMonth).format('MM/YYYY'),
      data: plotData,
      stepped: true,
      backgroundColor: ['rgba(255,255,255, 0.2  )'],
      borderColor: ['rgba(50,50,50)'],
      borderWidth: 2,
      borderCapStyle: 'round',
      fill: true,
      id: dateId,
    }

    commit('PUSH_DATASET', chartDataObject)
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
