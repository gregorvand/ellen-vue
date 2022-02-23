<template>
  <div class="marketshare">
    <div class="chart-frame">
      <h3>Market share demo</h3>
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
        :height="300"
      />
    </div>

    <table>
      <caption>
        <div class="company-list">
          <div scope="col">Magic Spoon</div>
          <div scope="col">Catalina Crunch</div>
          <div scope="col">Schoolyard Snacks</div>
        </div>
      </caption>
      <thead>
        <tr>
          <th scope="col" class="text-left">Month</th>
          <th scope="col">Revenue</th>
          <th scope="col">Market share</th>
          <th scope="col">Revenue</th>
          <th scope="col">Market share</th>
          <th scope="col">Revenue</th>
          <th scope="col">Market share</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td data-label="Period" class="text-left">Oct Est</td>
          <td data-label="Magic Spoon">$3,461,531.70</td>
          <td>79.51%</td>
          <td data-label="Catalina Crunch">$444,120.36</td>
          <td>10.20%</td>
          <td data-label="Schoolyard Snacks">$447,927.00</td>
          <td>10.29%</td>
        </tr>
        <tr>
          <td scope="row" data-label="Period" class="text-left">Nov Est</td>
          <td data-label="Magic Spoon">$3,426,473.16</td>
          <td>80.34%</td>
          <td data-label="Catalina Crunch">$444,201.14</td>
          <td>10.41%</td>
          <td data-label="Schoolyard Snacks">$394,402.22</td>
          <td>9.25%</td>
        </tr>
        <tr>
          <td scope="row" data-label="Period" class="text-left">Dec Est</td>
          <td data-label="Magic Spoon">$2,400,591.60</td>
          <td>77.30%</td>
          <td data-label="Catalina Crunch">$333,175.93</td>
          <td>10.73%</td>
          <td data-label="Schoolyard Snacks">$371,956.47</td>
          <td>11.98%</td>
        </tr>
      </tbody>
    </table>
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
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45,
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
    padding-bottom: 160px;

    @include breakpoint(small only) {
      display: none;
    }
  }

  .chart-frame {
    position: relative;
    min-height: 500px;
    p {
      font-size: 12px;
    }
  }
}

table {
  border: 1px solid #ccc;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  width: 100%;
  table-layout: fixed;
}

table caption {
  font-size: 1.5em;
  margin: 0.5em 0 0.75em;
}

table tr {
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  padding: 0.35em;
}

table th,
table td {
  padding: 0.625em;
  text-align: center;
  font-size: 13px;
}

table th {
  font-size: 0.85em;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.company-list {
  display: flex;
  width: 100%;
  padding-left: 15%;

  div {
    flex-basis: 33%;
    font-size: 18px;
  }

  @include breakpoint(small only) {
    display: none;
  }
}

.text-left {
  @include breakpoint(medium up) {
    text-align: left;
  }
}

@include breakpoint(small only) {
  table {
    border: 0;
  }

  table caption {
    font-size: 1.3em;
  }

  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: 0.625em;
  }

  table td {
    border-bottom: 1px solid #ddd;
    display: block;
    text-align: right;
  }

  table td::before {
    /*
    * aria-label has no advantage, it won't be read inside a table
    content: attr(aria-label);
    */
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }

  table td:last-child {
    border-bottom: 0;
  }
}
</style>
