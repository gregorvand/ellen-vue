<template>
  <div class="chart-wrapper global-max-width">
    <div class="chart-frame">
      <LineChart
        v-if="orderList.length > 0"
        ref="chartRef"
        :chartData="chartData"
        :options="options"
        :class="'ellen-chart'"
      />
      <div v-else>Loading chart..</div>
      <div class="scroll-enabler-mobile">
        <!-- this area is just to enable scroll from underneath the chart -->
      </div>
    </div>
    <TimeFrameSelector
      :hasAccess="hasAccess"
      @data-subscribed="getAccessibleDatasets()"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  inject,
} from '@vue/composition-api'
// import { mapState } from 'vuex'
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
// import { CrosshairPlugin } from 'chartjs-plugin-crosshair' - iterferes with scroll/pan

import 'chartjs-adapter-date-fns'
import TimeFrameSelector from './TimeFrameSelector.vue'
import axios from 'axios'
import { mapState } from 'vuex'

import { defaultChartOptions } from '../helpers/chart_helpers'

Chart.register(...registerables, zoomPlugin)

export default defineComponent({
  components: { LineChart, TimeFrameSelector },
  props: {
    companyId: {
      required: true,
    },
    companyName: {
      type: String,
    },
    orderCache: {
      type: Array,
    },
    earliestDate: {
      type: String,
    },
  },
  data: () => {
    return {
      loaded: false,
      selectedCompanies: [],
      monthsAvailable: [],
      hasAccess: [],
    }
  },
  computed: {
    ...mapState('selectedDataSets', ['currentDataSets']),
    dataSetData() {
      return this.currentDataSets.map((dataset) => dataset.data)
    },
  },

  setup(props) {
    const store = inject('vuex-store')
    const orderList = ref([]) // vue3 construct reactive var
    const chartRef = ref()
    const dataSetsRef = ref([])
    dataSetsRef.value = store.state.selectedDataSets.currentDataSets

    // SETUP data and options
    const chartData = computed(() => ({
      datasets: dataSetsRef.value
        .filter((data) => data.metaData.companyId == props.companyId)
        .filter((data) => data.metaData.activated == true) // for current Chart, only use data if Company ID matches dataset in store
        .map((data) => data.chartData), // use chartData part of object
    }))

    onMounted(async () => {
      const setValues = await getDataPoints(props.companyId, false)
      orderList.value = setValues.data
    })

    // set up chart type from our default options
    const options = defaultChartOptions

    return {
      chartData,
      options,
      orderList,
      getDataPoints,
      chartRef,
      dataSetsRef,
    }
  },
  created() {
    axios({
      method: 'post',
      url: `${process.env.VUE_APP_API_URL}/api/dashboard`,
      data: {
        companyType: 'private',
      },
    }).then(({ data }) => {
      this.selectedCompanies = data.companies
    })
    this.$store.dispatch('selectedCompanies/clearCompanySelection') // ideally state becomes saved companies
  },
  mounted() {
    this.getAccessibleDatasets()
  },
  methods: {
    async getAccessibleDatasets() {
      let monthAccess = await axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/api/dataset-access/company-by-user`,
        params: {
          companyId: this.companyId,
        },
      })
      this.hasAccess = monthAccess.data.map((data) => data.datasetId)
      this.$store.dispatch('credits/fetchBalance')
    },
  },
})

async function getDataPoints(companyId, months) {
  return await axios({
    method: 'post',
    url: `${process.env.VUE_APP_API_URL}/api/companies/orders`,
    data: {
      companyId: companyId,
      lookbackMonths: months,
    },
  })
}
</script>

<style scoped lang="scss">
.chart-wrapper {
  position: relative;
  overflow: hidden;
  width: 100vw;

  .chart-frame {
    position: relative;
  }
}

button {
  margin: 10px;
  padding: 20px;
  font-size: $small-label-font-size;
  line-height: 1;
}

.scroll-enabler-mobile {
  @include breakpoint(small only) {
    position: absolute;
    // border: solid red thin;
    width: 100%;
    height: 70px;
    bottom: 0;
  }
}

.company-selector {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

button {
  margin: 10px;
  padding: 20px;
}

// animations
@keyframes data-enter-up {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0%);
  }
}
</style>
