const firstDateofMonth = (tooltipItems) => {
  let startDate
  tooltipItems.forEach(function (tooltipItem) {
    startDate = tooltipItem.dataset.data[tooltipItem.dataIndex].label
  })
  return `(from ${startDate})`
}

const defaultChartOptions = {
  scales: {
    y: {
      beginAtZero: true,
      type: 'linear',
    },

    x: {
      type: 'timeseries',
      distribution: 'linear',
      time: {
        unit: 'month',
        stepSize: '1',
      },
      ticks: {
        alignment: 'center',
        source: 'data',
        maxRotation: 45,
        minRotation: 45,
      },
      gridLines: {
        display: false,
        tickMarkLength: 15,
      },
      time: {
        minUnit: 'month',
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
    tooltip: {
      callbacks: {
        footer: firstDateofMonth,
      },
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

        mode: 'x',
      },
      limits: {
        x: { min: 'original', max: 'original' },
        y: { min: 'original', max: 'original' },
      },
    },
  },
}

module.exports = { defaultChartOptions: defaultChartOptions }
