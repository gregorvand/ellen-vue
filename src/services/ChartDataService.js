import axios from 'axios'
export default {
  async getChartData(component, companyId, identifier, selectedYear = '2021') {
    if (companyId !== '' && selectedYear) {
      let initialChartData = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/api/dataset-year-company-indexed`,
        params: {
          companyId: companyId,
          year: selectedYear,
          identifier: identifier,
        },
      })
      component.$store.dispatch(
        'selectedDataSetsV2/getAndStoreDataSet',
        initialChartData.data
      )
    }
  },

  async userAccessRecord(identifier) {
    let userAccessArray = await axios({
      method: 'get',
      url: `${process.env.VUE_APP_API_URL}/api/dataset-access/company-by-user`,
      params: {
        identifier: identifier,
      },
    })

    return userAccessArray
  },

  async getCompany(companyId) {
    let indexedCompany = await axios({
      method: 'get',
      url: `${process.env.VUE_APP_API_URL}/api/get-company`,
      params: {
        id: companyId,
      },
    })

    return indexedCompany
  },
}
