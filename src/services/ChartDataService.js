import axios from 'axios'
export default {
  async getChartData(component, companyId, identifier, selectedYear = '2021') {
    console.log('yep', identifier)
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

  async userAccessRecord(companyId) {
    let userAccessArray = await axios({
      method: 'get',
      url: `${process.env.VUE_APP_API_URL}/api/dataset-access/company-by-user`,
      params: {
        companyId: companyId,
      },
    })

    return userAccessArray
  },

  async getCompany(companyId) {
    console.log('????', companyId)
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
