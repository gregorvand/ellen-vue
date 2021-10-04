export const namespaced = true // ie user/[action]
import dayjs from 'dayjs'
import axios from 'axios'

export const state = () => ({
  currentDataSets: [],
  selectedDateIDs: [],
  datasetCart: [],
})

export const getters = {
  userHasSelectedDates: (state) => (id) => {
    return state.selectedDateIDs.find((selectedDates) => selectedDates === id)
  },

  datasetCart(state) {
    return state.datasetCart
  },
}

export const mutations = {
  PUSH_DATE(state, dateId) {
    state.selectedDateIDs.push(dateId)
  },
  REMOVE_DATE(state, dateIdToRemove) {
    state.selectedDateIDs = state.selectedDateIDs.filter(
      (date) => date !== dateIdToRemove
    )
  },
  DEACTIVATE_DATESET(state, dateId) {
    const selectedSet = state.currentDataSets.find(
      (dataSet) => dataSet.chartData.id == dateId
    )
    selectedSet.metaData.activated = false
  },
  PUSH_DATASET(state, dataset) {
    state.currentDataSets.push(dataset)
  },

  PUSH_TO_CART(state, dateId) {
    state.datasetCart.push(dateId)
  },
  REMOVE_FROM_CART(state, dateToRemove) {
    state.datasetCart = state.datasetCart.filter(
      (date) => date !== dateToRemove
    )
  },
  CLEAR_CART(state) {
    state.datasetCart = []
  },
}

export const actions = {
  addDateToSelection({ commit, dispatch }, { date, company, id }) {
    commit('PUSH_DATE', id)
    dispatch('getAndStoreDataSet', { ...date, company, id })
    // trigger same DataSet to be retrieved and added
  },
  removeDateSelection({ commit }, date) {
    commit('REMOVE_DATE', date)
    //  trigger DataSet to be deactivated
    // avoid extra API calls by keeping in store but deactivating
  },
  deactivateDataSet({ commit }, dateId) {
    commit('DEACTIVATE_DATESET', dateId)
    //  trigger DataSet to be deactivated
    // avoid extra API calls by keeping in store but deactivating
  },

  addDatasetToCart({ commit }, dateId) {
    commit('PUSH_TO_CART', dateId)
  },
  removeDatasetFromCart({ commit }, dateId) {
    commit('REMOVE_FROM_CART', dateId)
  },
  clearDatasetCart({ commit }) {
    commit('CLEAR_CART')
  },

  async getAndStoreDataSet({ commit, state }, payload) {
    // Push to dataset
    // generate Start and end date
    const { date, company, id } = payload
    const date1 = date
    const date2 = dayjs(date1).endOf('month').toISOString()

    // check if we already have this dataset in the store using payload.id
    const checkDatasetExists = state.currentDataSets.find(
      (dataset) => dataset.chartData.id == id
    )
    if (checkDatasetExists) {
      checkDatasetExists.metaData.activated = true
    } else {
      // API call for dataset
      const dataset = await getDataPoints(company, date1, date2)
      const plotData = dataset.data
      const dataMonth = plotData[plotData.length - 1].x // determine month/yr for label from final datapoint

      const chartDataObject = {
        label: dayjs(dataMonth).format('MM/YYYY'),
        data: plotData,
        stepped: true,
        backgroundColor: ['rgba(255,255,255, 0.2  )'],
        borderColor: ['rgba(50,50,50)'],
        borderWidth: 2,
        borderCapStyle: 'round',
        fill: true,
        id: id,
      }

      const metaData = {
        companyId: company,
        activated: true,
      }

      const fullChartData = { chartData: chartDataObject, metaData: metaData }

      commit('PUSH_DATASET', fullChartData)
    }
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
