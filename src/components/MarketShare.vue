<template>
  <div class="marketshare">
    <h3>Market share demo</h3>

    <div class="chart-frame">
      <div class="watermark">
        <img
          src="@/assets/ellen_ms_logo.svg"
          class="logo"
          alt="welcome to ELLEN insights"
        />
        <p>
          Coming soon
          <br />
          Contact our team for custom market share reports to see how you're
          tracking versus your competitors.
        </p>
        <h4>DTC Breakfast Cereal leaders</h4>
      </div>
      <LineChart
        ref="chartRef"
        :chartData="chartData"
        :options="options"
        :class="'ellen-chart'"
        :width="800"
      />
    </div>
  </div>
</template>

<script>
import { LineChart } from 'vue-chart-3'
export default {
  components: { LineChart },

  data() {
    const month_one = 'October 2021'
    const month_two = 'November 2021'
    const month_three = 'December 2021'
    return {
      computed: {
        gradient() {
          let canvas = document.getElementById('line-chart')
          let ctx = canvas.getContext('2d')
          let gradient = ctx.createLinearGradient(0, 0, 0, 300) // value at the end alters height of gradient
          gradient.addColorStop(0, 'rgba(5,118,156,.5)')
          gradient.addColorStop(1, 'rgba(255,255,255,.8)')

          return gradient
        },
      },
      chartData: {
        datasets: [
          {
            borderColor: '#efefef',
            fill: true,
            label: 'Magic Spoon',
            backgroundColor: '#FFFBDB ',
            data: [
              { x: month_one, y: 79.5 },
              { x: month_two, y: 80.34 },
              { x: month_three, y: 77.3 },
            ],
          },
          {
            borderColor: '#efefef',
            backgroundColor: '#E7C280',
            fill: true,
            label: 'Catalina Crunch',
            data: [
              { x: month_one, y: 10.2 },
              { x: month_two, y: 10.41 },
              { x: month_three, y: 10.72 },
            ],
          },
          {
            borderColor: '#efefef',
            backgroundColor: '#ff9800',
            fill: true,
            label: 'Schoolyard Snacks',
            data: [
              { x: month_one, y: 10.3 },
              { x: month_two, y: 9.25 },
              { x: month_three, y: 11.98 },
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            reverse: true,
          },
        },
        interaction: {
          mode: 'nearest',
          interesectors: true,
        },
        scales: {
          y: {
            stacked: true,
            ticks: {
              min: 0,
              max: 100,
              autoSkip: true,
              maxTicksLimit: 100,
              stepSize: 10,
              callback: function (value) {
                return value + '%'
              },
            },
            scaleLabel: {
              display: true,
              labelString: 'Percentage',
            },
          },
        },
        maintainAspectRatio: false,
      },
      // options: defaultChartOptions,
    }
  },
}
</script>

<style lang="scss" scoped>
.marketshare {
  background-color: $color-ellen-light-gray;
  width: 100%;
  padding: 20px;
  position: relative;
  border-radius: $border-radius;
  margin: $global-margin + 40px auto;

  h3 {
    position: absolute;
    left: 0;
    display: flex;
    height: 100%;
    width: 100%;
    align-items: flex-end;
    justify-content: center;
    opacity: 0.3;
    pointer-events: none;
    padding-bottom: 90px;
  }

  .chart-frame {
    min-height: 500px;
    p {
      font-size: 12px;
    }
  }
}
</style>
