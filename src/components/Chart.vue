<template>
  <div>
    <div class="chart-wrapper">
      <button @click="getMonthDuration(0)">All data</button>
      <button @click="getMonthDuration(3)">Last 3 months</button>
      <button @click="getMonthDuration(6)">Last 6 months</button>
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
        @click="getCompareCompanyDetails(company)"
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
import { defineComponent, onMounted, ref, computed } from '@vue/composition-api'
// import { mapState } from 'vuex'
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
// import { CrosshairPlugin } from 'chartjs-plugin-crosshair' - iterferes with scroll/pan

import 'chartjs-adapter-date-fns'
import ChartCompanySelector from '../components/ChartCompanySelector.vue'
import axios from 'axios'
import { mapState } from 'vuex'

Chart.register(...registerables, zoomPlugin)

export default defineComponent({
  components: { LineChart, ChartCompanySelector },
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
  },

  setup(props) {
    const orderList = ref([]) // vue3 construct reactive var
    const secondOrderList = ref([])
    const chartRef = ref()
    const compareDataID = ref(0)
    const compareDataName = ref('')
    // const comparisonCompany = ref([])'

    onMounted(async () => {
      const setValues = await getDataPoints(props.companyId, false)
      orderList.value = setValues.data

      const setSecondValues = await getDataPoints(compareDataID.value, false)
      secondOrderList.value = setSecondValues.data
    })

    // for comparison data
    async function getCompareCompanyDetails(company) {
      compareDataID.value = company.id

      const setSecondValues = await getDataPoints(compareDataID.value, false)
      secondOrderList.value = setSecondValues.data
      compareDataName.value = company.nameIdentifier

      chartRef.value.chartInstance.resetZoom()
    }

    async function getMonthDuration(months = false) {
      const setValues = await getDataPoints(props.companyId, months)
      orderList.value = setValues.data

      const setSecondValues = await getDataPoints(compareDataID.value, months)
      secondOrderList.value = setSecondValues.data

      chartRef.value.chartInstance.resetZoom()
    }

    // SETUP data and options
    const chartData = computed(() => ({
      datasets: [
        {
          label: `Avg Orders/day for ${props.companyName}`,
          data: orderList.value,
          stepped: true,
          backgroundColor: ['rgba(255,255,255, 0.2  )'],
          borderColor: ['rgba(100, 222, 250)'],
          borderWidth: 2,
          borderCapStyle: 'round',
          fill: true,
        },
        {
          label: `${compareDataName.value}`,
          data: secondOrderList.value,
          stepped: true,
          backgroundColor: '#efefef',
          borderColor: ['rgba(196, 196, 196, 0.5)'],
          borderWidth: 2,
          borderCapStyle: 'round',
          fill: true,
        },

        // chartRef.value.chartInstance.dataSets = datasets),
      ],
    }))
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
          type: 'logarithmic',
        },

        x: {
          type: 'time',
          distribution: 'linear',
          time: {
            unit: 'month',
            stepSize: '1',
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
      getMonthDuration,
      getCompareCompanyDetails,
      chartRef,
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

// async function getUserCompanies() {
//   return axios.get(`${process.env.VUE_APP_API_URL}/api/dashboard`)
// }
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
