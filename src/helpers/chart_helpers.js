const defaultChartOptions = {
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

module.exports = { defaultChartOptions: defaultChartOptions }
