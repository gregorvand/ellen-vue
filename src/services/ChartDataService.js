import axios from 'axios'
export default {
  async getChartData(component, companyId, selectedYear = '2021') {
    let initialChartData = await axios({
      method: 'get',
      url: `${process.env.VUE_APP_API_URL}/api/dataset-year-company-v2`,
      params: {
        companyId: companyId,
        year: selectedYear,
      },
    })
    console.log(initialChartData)
    component.$store.dispatch(
      'selectedDataSetsV2/getAndStoreDataSet',
      initialChartData.data
    )
  },
}
