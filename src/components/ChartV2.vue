<template>
  <div>
    <div class="chart-wrapper">
      <div class="chart-timeframe-selector">
        <!-- eventually we want a store of valid months that will generate the buttons -->
        <DateSelector :date="{ date: '09/01/2020' }" />
        <DateSelector :date="{ date: '10/01/2020' }" />
        <DateSelector :date="{ date: '11/01/2020' }" />
        <DateSelector :date="{ date: '12/01/2020' }" />
      </div>
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

    <h3>Compare</h3>
    <ul class="compare-list">
      <li
        v-for="company in selectedCompanies"
        :key="company.id"
        @click="getCompareCompanyDetails(company, 0)"
      >
        <ChartCompanySelector
          :class="{ active: compareCompany == company.id }"
          v-if="company.companyType == 'private'"
          :company="company"
          :current="compareCompany[0]"
        />
      </li>
    </ul>
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
import ChartCompanySelector from './ChartCompanySelector.vue'
import DateSelector from './DateSelector.vue'
import axios from 'axios'
import { mapState } from 'vuex'

Chart.register(...registerables, zoomPlugin)

export default defineComponent({
  components: { LineChart, ChartCompanySelector, DateSelector },
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
    }
  },
  computed: {
    ...mapState('compareCompany', ['compareCompany']),
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

    const options = {
      elements: {
        point: {
          pointStyle: 'dash',
          borderWidth: 0,
        },
      },
      scales: {
        y: {
          ticks: {
            beginAtZero: true,
          },
          type: 'linear',
        },

        x: {
          type: 'time',
          distribution: 'linear',
          time: {
            unit: 'day',
            stepSize: '1',
          },
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45, // stops jumping on mobile if always set
          },
          gridLines: {
            display: false,
          },
        },
      },
      interaction: {
        intersect: false,
        mode: 'nearest',
      },
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          position: 'top',
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'x',
            speed: 0.1,
            threshold: 10,
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            // drag: {
            //   enabled: true,
            // },
            mode: 'x',
          },
          limits: {
            x: { min: 'original', max: 'original' },
            y: { min: 'original', max: 'original' },
          },
        },
      },
    }

    // loaded = true

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
  width: 100%;
  position: relative;
  overflow: hidden;
  width: 100vw;
}

button {
  margin: 10px;
  padding: 20px;
  font-size: 12px;
  line-height: 1;
}

.chart-timeframe-selector {
  display: flex;
  justify-content: center;
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

ul,
li {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

ul {
  width: 100%;
  @include breakpoint(small only) {
    flex-direction: column;
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
</style>
