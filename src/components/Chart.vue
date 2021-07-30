<template>
  <LineChart :chartData="testData" :options="options" />
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import 'chartjs-adapter-date-fns'

Chart.register(...registerables)

export default defineComponent({
  components: { LineChart },
  setup() {
    const testData = {
      datasets: [
        {
          label: 'Orders',
          data: [
            {
              y: '41.30',
              x: '2018-12-17T20:32:00.000Z',
            },
            {
              y: '40.39',
              x: '2019-02-26T14:38:00.000Z',
            },
            {
              y: '41.30',
              x: '2019-04-03T17:42:00.000Z',
            },
            {
              y: '41.23',
              x: '2019-07-29T10:47:00.000Z',
            },
          ],
          stepped: true,
          backgroundColor: ['rgba(216, 216, 216, 0.3)'],
          borderColor: ['rgba(0, 0, 0, 0.9)'],
          borderWidth: 2,
          borderCapStyle: 'round',
        },
      ],
    }

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

    return { testData, options }
  },
})
</script>
