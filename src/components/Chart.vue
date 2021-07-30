<template>
  <LineChart
    v-if="orderList.length > 0"
    :chartData="testData"
    :options="options"
  />
  <div v-else>Loading chart..</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from '@vue/composition-api'
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import 'chartjs-adapter-date-fns'
import axios from 'axios'

Chart.register(...registerables)

export default defineComponent({
  components: { LineChart },
  data: () => {
    return {
      loaded: false,
    }
  },
  setup() {
    const orderList = ref([]) // vue3 construct reactive var
    onMounted(async () => {
      const res = await axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}/api/orders`,
        data: {
          companyId: 5,
        },
      })
      orderList.value = res.data
      console.log(res.data)
    })

    const testData = computed(() => ({
      datasets: [
        {
          label: 'Orders',
          data: orderList.value,
          stepped: true,
          backgroundColor: ['rgba(216, 216, 216, 0.3)'],
          borderColor: ['rgba(0, 0, 0, 0.9)'],
          borderWidth: 2,
          borderCapStyle: 'round',
        },
      ],
    }))

    const options = {
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
            displayFormats: {
              quarter: 'MMM YYYY',
            },
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

    return { testData, options, orderList }
  },
})
</script>
