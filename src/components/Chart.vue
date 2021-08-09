<template>
  <div :class="'chart-wrapper'" style="width: 100%; overflow-x: auto">
    <LineChart
      v-if="orderList.length > 0"
      :chartData="testData"
      :options="options"
    />
    <div v-else>Loading chart..</div>
    <button @click="getMonthDuration(0)">All data</button>
    <button @click="getMonthDuration(3)">Last 3 months</button>
    <button @click="getMonthDuration(6)">Last 6 months</button>

    <SearchForm />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from '@vue/composition-api'
// import { mapState } from 'vuex'
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import SearchForm from './SearchForm.vue'
import 'chartjs-adapter-date-fns'
import axios from 'axios'

Chart.register(...registerables)

export default defineComponent({
  components: { LineChart, SearchForm },
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
    }
  },
  setup(props) {
    const orderList = ref([]) // vue3 construct reactive var
    const secondOrderList = ref([])

    onMounted(async () => {
      // console.log(props.companyId)
      const setValues = await getDataPoints(props.companyId, false)
      orderList.value = setValues.data

      const setSecondValues = await getDataPoints('22058', false)
      secondOrderList.value = setSecondValues.data
    })

    async function getMonthDuration(months = false) {
      const setValues = await getDataPoints(props.companyId, months)
      orderList.value = setValues.data

      const setSecondValues = await getDataPoints('22058', months)
      secondOrderList.value = setSecondValues.data
    }

    const testData = computed(() => ({
      datasets: [
        {
          label: `Avg Orders/day for ${props.companyName}`,
          data: orderList.value,
          stepped: true,
          backgroundColor: ['RGBA(255,209,90,0.22)'],
          pointBackgroundColor: 'blue',
          borderColor: ['rgba(196, 196, 196)'],
          borderWidth: 1,
          borderCapStyle: 'round',
          fill: true,
        },
        {
          label: 'compare company',
          data: secondOrderList.value,
          stepped: true,
          backgroundColor: ['RGBA(160, 207, 242, 0.1)'],
          pointBackgroundColor: 'blue',
          borderColor: ['rgba(196, 196, 196, 0.5)'],
          borderWidth: 1,
          borderCapStyle: 'round',
          fill: true,
        },
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
        y: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        x: {
          type: 'time',
          time: {
            unit: 'month',
          },
        },
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'index',
        intersect: false,
      },
      cubicInterpolationMode: 'monotone',
      responsive: true,
      aspectRatio: 2,
    }

    // loaded = true

    return {
      testData,
      options,
      orderList,
      getDataPoints,
      getMonthDuration,
    }
  },
  computed: {},
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
  max-width: 800px;
  overflow-x: scroll;
}

button {
  margin: 10px;
  padding: 20px;
}
</style>
