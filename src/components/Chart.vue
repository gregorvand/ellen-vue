<template>
  <div :class="'chart-wrapper'" style="width: 100%; overflow-x: auto">
    <LineChart
      v-if="orderList.length > 0"
      :chartData="testData"
      :options="options"
    />
    <div v-else>Loading chart..</div>
    <button @click="resetOrders">Reset stuff!</button>
    <button @click="getFromMay">Last 3 months</button>
    <button @click="resetOrders">Last 6 months</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from '@vue/composition-api'
// import { mapState } from 'vuex'
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import 'chartjs-adapter-date-fns'
import axios from 'axios'

Chart.register(...registerables)

export default defineComponent({
  components: { LineChart },
  props: {
    companyId: {
      required: true,
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
    const earliestDate = ref('')

    onMounted(async () => {
      // console.log(props.companyId)
      const setValues = await getDataPoints(props.companyId, false)
      orderList.value = setValues.data
    })

    function resetOrders() {
      orderList.value = [
        { x: '2020-01-01', y: 0 },
        { x: new Date(), y: 0 },
      ]
    }

    async function getFromMay() {
      const setValues = await getDataPoints(props.companyId, '2020-05-01')
      orderList.value = setValues.data
    }

    const testData = computed(() => ({
      datasets: [
        {
          label: 'Avg Orders/day',
          data: orderList.value,
          stepped: true,
          backgroundColor: ['RGBA(255,209,90,0.22)'],
          pointBackgroundColor: 'blue',
          borderColor: ['rgba(0, 0, 0, 0.9)'],
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
      resetOrders,
      getDataPoints,
      getFromMay,
    }
  },
  computed: {},
})

async function getDataPoints(companyId, date) {
  return await axios({
    method: 'post',
    url: `${process.env.VUE_APP_API_URL}/api/companies/orders`,
    data: {
      companyId: companyId,
      dateLimit: date,
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
