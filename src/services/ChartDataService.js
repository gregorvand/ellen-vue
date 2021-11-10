import axios from 'axios'
import Vue from 'vue'
export default {
  async getChartData(component, companyId, selectedYear = '2021') {
    if (companyId !== '' && selectedYear) {
      let initialChartData = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/api/dataset-year-company-indexed`,
        params: {
          companyId: companyId,
          year: selectedYear,
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
}
