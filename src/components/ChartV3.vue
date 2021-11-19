<template>
  <div class="chart-wrapper global-max-width">
    <div class="chart-frame">
      <LineChart
        ref="chartRef"
        :chartData="chartData"
        :options="options"
        :class="'ellen-chart'"
        :emailIdentifier="emailIdentifier"
      />

      <div class="scroll-enabler-mobile">
        <!-- this area is just to enable user to scroll from underneath the chart -->
      </div>
    </div>
    <TimeFrameSelectorPurchase
      v-if="companyObject.data !== undefined && chartLoaded"
      :hasAccess="hasAccess"
      :emailIdentifier="companyObject.data.emailIdentifier"
      :companyId="companyObject.data.id"
      @chartUpdateRequired="getAccessibleDatasets()"
    />
  </div>
</template>

<script lang="ts">
// - Get data from /api/dataset-year-company-v2
// - Present on chart
// - Also superficially show which months user has access to
// - If user purchases new access, re-run first command
// - Start with years being toggled rather than added (and cached)
// - Move to joining years

import {
  defineComponent,
  ref,
  onMounted,
  inject,
  computed,
} from '@vue/composition-api'
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'

import 'chartjs-adapter-date-fns'
// import TimeFrameSelector from './TimeFrameSelectorV3.vue'
import TimeFrameSelectorPurchase from './TimeFrameSelectorPurchase.vue'
import axios from 'axios'
import { mapState } from 'vuex'
import ChartDataService from '../services/ChartDataService'

import { defaultChartOptions } from '../helpers/chart_helpers'

Chart.register(...registerables, zoomPlugin)

export default defineComponent({
  components: { LineChart, TimeFrameSelectorPurchase },
  props: {
    companyName: {
      type: String,
    },
    emailIdentifier: {
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
    companyObject: {
      type: Object,
    },
  },
  data: () => {
    return {
      loaded: false,
      selectedCompanies: [],
      monthsAvailable: [],
      hasAccess: [],
      fetchedUserAccessData: false,
      chartLoaded: false,
    }
  },
  computed: {
    ...mapState('selectedDataSetsV2', ['currentActiveDataSet', 'currentYear']),
  },

  setup(props) {
    const store = inject('vuex-store')
    const chartRef = ref()
    const gradRef = ref()
    const dataSetsRef = ref([])
    // SETUP data and options

    onMounted(() => {
      var canvas = document.getElementById('line-chart')
      var ctx = canvas.getContext('2d')
      var gradient = ctx.createLinearGradient(0, 0, 0, 300) // value at the end alters height of gradient
      gradient.addColorStop(0, 'rgba(5,118,156,.5)')
      gradient.addColorStop(1, 'rgba(255,255,255,.8)')

      gradRef.value = gradient
      dataSetsRef.value = store.state.selectedDataSetsV2.currentActiveDataSet
    })
    const chartData = computed(() => ({
      datasets: [
        {
          borderColor: '#05769C',
          fill: true,
          backgroundColor: gradRef.value,
          data: dataSetsRef.value
            .filter((data) => data.company == props.companyObject.data.id)
            .map((data) => data.monthly)
            .flat(),
        },
      ],
    }))
    // set up chart type from our default options
    const options = defaultChartOptions

    return {
      chartData,
      options,
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
      this.chartLoaded = true
    })
    this.getAccessibleDatasets()
    this.$store.dispatch('selectedCompanies/clearCompanySelection') // ideally state becomes saved companies
  },

  methods: {
    async getAccessibleDatasets() {
      // console.log('sending', this.currentYear)
      // console.log(
      //   'sending1',
      //   this.companyObject.data.id,
      //   this.companyObject.data.emailIdentifier,
      //   this.currentYear
      // )
      ChartDataService.getChartData(
        this,
        this.companyObject.data.id,
        this.companyObject.data.emailIdentifier,
        this.currentYear
      )
    },

    toggleView(chartType) {
      this.$store.dispatch('selectedDataSets/updateChartMode', chartType)
    },
  },
})
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
