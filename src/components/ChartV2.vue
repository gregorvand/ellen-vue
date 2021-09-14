<template>
  <div>
    <div>Select year</div>
    <ul class="year-select">
      <li
        v-for="year in yearsChoice"
        :key="year"
        @click="getAvailableDates(year)"
        :class="{ active: selectedYear == year }"
      >
        {{ year }}
      </li>
    </ul>
    <div class="chart-wrapper">
      Select months to show
      <div class="chart-timeframe-selector">
        <div
          v-if="monthsAvailable[0] != 'loading'"
          class="months-available-wrapper"
          :class="{ active: monthsAvailable.length > 0 }"
        >
          <!-- eventually we want a store of valid months that will generate the buttons -->
          <DateSelector
            v-for="month in monthsAvailable"
            :date="{ date: month, year: selectedYear }"
            :key="month.month + selectedYear"
          />
          <span class="data-not-available" v-if="monthsAvailable.length == 0"
            >No data for this year available</span
          >
        </div>
        <div v-else class="months-available-wrapper">
          <BaseLoadingSpinner />
        </div>
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
import DateSelector from './DateSelector.vue'
import axios from 'axios'
import { mapState } from 'vuex'
import dayjs from 'dayjs'

Chart.register(...registerables, zoomPlugin)

export default defineComponent({
  components: { LineChart, DateSelector },
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
      selectedYear: dayjs().year(),
      yearsChoice: [2017, 2018, 2019, 2020, 2021],
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
          display: false,
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
    }),
      this.getAvailableDates()
    this.$store.dispatch('selectedCompanies/clearCompanySelection') // ideally state becomes saved companies
  },
  methods: {
    getAvailableDates(year = dayjs().year()) {
      this.monthsAvailable = ['loading'] // clear month UI
      this.selectedYear = year
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}/api/orders/dates-available`,
        data: {
          companyId: this.companyId,
          year: year,
        },
      }).then(({ data }) => {
        this.monthsAvailable = data
      })
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
  width: 100%;
  overflow: hidden;

  .data-not-available {
    font-size: 11px;
    color: $color-ellen-dark;
  }
}

.months-available-wrapper {
  height: 50px;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  overflow: scroll;
  padding: 10px;
  // border: solid black thin;
  align-items: center;
  transform: translateY(0);

  &.active {
    animation: data-enter-up 1s forwards;
  }

  @include breakpoint(medium up) {
    justify-content: center;
  }
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

ul.year-select {
  margin: 10px auto;
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  > li {
    @extend %heading-font-family;
    font-size: 11px;
    margin: 0 5px;
    cursor: pointer;

    &:hover {
      color: $color-ellen-dark;
    }

    &.active {
      text-decoration: underline;
      color: $color-ellen-dark;
    }
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
