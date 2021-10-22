export const namespaced = true // ie user/[action]
import dayjs from 'dayjs'
import axios from 'axios'
import Vue from 'vue'

export const state = () => ({
  currentDataSets: [],
  shadowDataSets: [],
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

  currentActiveDataSets(state) {
    return state.currentDataSets
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
  SWAP_DATASET(state, dataset) {
    // below needed to entirely replace the array and maintain reactivity
    if (state.currentDataSets.length > 0) {
      state.currentDataSets.shift()
      state.currentDataSets.push(dataset)
    } else {
      state.currentDataSets.push(dataset)
    }
  },

  CLEAR_DATASET(state) {
    // Vue.set(state, 'currentDataSets', [])
    state.currentDataSets.splice(0, state.currentDataSets.length)
  },

  SWAP_SHADOW_DATASET(state, dataset) {
    state.shadowDataSets.push(dataset)
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
  clearDataset({ commit }) {
    commit('CLEAR_DATASET')
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
      const plotData = dataset.data.daily
      const plotDataMonthly = dataset.data.monthly
      const dataMonth = dayjs(plotData[plotData.length - 1].x) // determine month/yr for label from final datapoint

      const chartDataObjectDaily = {
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

      let chartDataObjectMonthly = {
        label: dayjs(dataMonth).format('MM/YYYY'),
        type: 'bar',
        data: plotDataMonthly,
        fill: true,
        // barPercentage: 1,
        // categoryPercentage: 1,
        // tickMarkLength: 15,
        barThickness: 25,
        offset: false,
      }

      const metaData = {
        companyId: company,
        activated: true,
      }

      const fullChartData = {
        chartData: chartDataObjectDaily,
        chartDataMonthly: chartDataObjectMonthly,
        metaData: metaData,
      }

      // We compile the ChartData full array in the shadowDataSet first,
      // Then send that up as a completed array to the live currentDataSets
      // So that we can sort all of the dates into date order first, and
      // it gives a nicer render than populating the chart sporadically with each dataset
      commit('SWAP_SHADOW_DATASET', fullChartData)

      if (state.shadowDataSets.length === state.selectedDateIDs.length) {
        let sorted = state.shadowDataSets.sort(function (a, b) {
          if (a.chartDataMonthly.data[0].x > b.chartDataMonthly.data[0].x)
            return 1
          if (a.chartDataMonthly.data[0].x < b.chartDataMonthly.data[0].x)
            return -1
        })

        // combine all data into one array to be able to plot one continuous line
        const flattenedPlotData = sorted.map((data) => {
          return data.chartDataMonthly.data[0]
        })

        var canvas = document.getElementById('line-chart')
        var ctx = canvas.getContext('2d')
        var gradient = ctx.createLinearGradient(0, 0, 0, 300) // value at the end alters height of gradient
        gradient.addColorStop(0, 'rgba(5,118,156,.5)')
        gradient.addColorStop(1, 'rgba(255,255,255,.8)')
        console.log(ctx)

        let allData = {
          chartData: { id: chartDataObjectDaily.id },
          chartDataMonthly: {
            type: 'line',
            data: flattenedPlotData,
            borderColor: '#05769C',
            backgroundColor: gradient,
            fill: true,
          },
          metaData: metaData,
        }

        commit('SWAP_DATASET', allData)
      }
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
