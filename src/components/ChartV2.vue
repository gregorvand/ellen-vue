<template>
  <div class="chart-wrapper global-max-width">
    <div
      class="chart-frame"
      :class="{ 'chart-unavailable': hasAccess.length == 0 }"
    >
      <LineChart
        v-if="orderList.length > 0"
        ref="chartRef"
        :chartData="chartData"
        :options="options"
        :class="'ellen-chart'"
      />
      <div class="chart-loading-frame" v-else><BaseLoadingSpinner /></div>
      <div class="scroll-enabler-mobile">
        <!-- this area is just to enable user to scroll from underneath the chart -->
      </div>
    </div>
    <div class="chart-type-selectors">
      <button @click="toggleView('chartDataMonthly')">Monthly</button>
      <button @click="toggleView('chartData')">Daily</button>
    </div>
    <TimeFrameSelector
      v-if="fetchedUserAceesData"
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
    chartView: {
      type: String,
    },
  },
  data: () => {
    return {
      loaded: false,
      selectedCompanies: [],
      monthsAvailable: [],
      hasAccess: [],
      fetchedUserAceesData: false,
    }
  },
  computed: {
    ...mapState('selectedDataSets', ['currentActiveDataSets']),
  },

  setup(props) {
    const store = inject('vuex-store')
    const orderList = ref([]) // vue3 construct reactive var
    const chartRef = ref()
    const dataSetsRef = ref([])
    dataSetsRef.value = store.state.selectedDataSets.currentActiveDataSets
    const chartType = ref()
    chartType.value = store.state.selectedDataSets.chartMode

    // SETUP data and options
    const chartData = computed(() => ({
      datasets: dataSetsRef.value
        .filter((data) => data.metaData.companyId == props.companyId)
        .filter((data) => data.metaData.activated == true) // for current Chart, only use data if Company ID matches dataset in store
        .map((data) => data[chartType.value[0]]), // use chartData part of object
    }))

    const chartMode = computed(() => {
      return chartType.value
    })

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
      chartMode,
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
    this.getAccessibleDatasets()
    this.$store.dispatch('selectedCompanies/clearCompanySelection') // ideally state becomes saved companies
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
      this.fetchedUserAceesData = true
    },
    toggleView(chartType) {
      this.$store.dispatch('selectedDataSets/updateChartMode', chartType)
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
  min-height: 500px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .chart-frame,
  .ellen-chart {
    position: relative;
    display: flex;
    width: 100%;

    &.chart-unavailable {
      pointer-events: none;
      opacity: 0.2;
    }
  }
}

.chart-loading-frame {
  height: 400px;
  widows: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 0 auto;
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

.chart-type-selectors {
  display: flex;
  justify-content: flex-start;
  width: 100%;

  > button {
    max-width: 100px;
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
