<template>
  <div class="timeframe-selector-wrapper container">
    <ul class="year-select">
      <li
        v-for="(year, index) in yearsChoice"
        :key="year"
        @click="getAvailableDates(year)"
      >
        <span
          class="year-select-link"
          :class="{ active: selectedYear == year }"
          >{{ year }}</span
        >
        <span class="divider" v-if="index + 1 < yearsChoice.length"> |</span>
      </li>
    </ul>
    <div class="container no-padding">
      <h4>Months presented on chart</h4>
      <div class="chart-timeframe-selector">
        <DateLabel
          v-for="accessObject in accessArray"
          :dateID="accessObject.datasetId"
          :key="`${accessObject.id}`"
        />
        <span class="data-not-available" v-if="accessArray.length == 0"
          >No purchased months</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import DateLabel from './DateLabel.vue'
import dayjs from 'dayjs'
import ChartDataService from '../services/ChartDataService'
import { mapState } from 'vuex'

export default {
  components: { DateLabel },
  props: {
    hasAccess: {
      type: Array,
    },
    purchaseMode: {
      type: Boolean,
    },
  },
  data: function () {
    return {
      selectedYear: '', // set initially by getAccessibleDataset
      monthsAvailable: [],
      yearsChoice: [2015, 2016, 2017, 2018, 2019, 2020, 2021],
      purchasedMonths: [],
    }
  },
  computed: {
    currentCompanyId() {
      return this.$route.params.id
    },
    accessArray() {
      const currentCompanyId =
        this.$route.params.id || this.$store.getters['company/getCompanyId']
      let companyDataSets = this.accessIDsByCompany.filter((dataset) => {
        return dataset.companyId == currentCompanyId
      })
      let filtered = companyDataSets[0].datasetIds.filter((dataset) => {
        return dataset.substr(-4) == this.selectedYear
          ? dataset.datasetId
          : false
      })
      let sorted = filtered.sort((a, b) => {
        let monthA = a.datasetId.substr(-8).substring(0, 2) - 1
        let monthB = b.datasetId.substr(-8).substring(0, 2) - 1
        return monthA - monthB
      })
      return sorted
    },
    ...mapState('datasetAccess', ['accessIDsByCompany']),
  },
  created() {
    this.getAvailableDates()
    this.$store.dispatch('selectedDataSets/clearDatasetCart')
  },
  methods: {
    async getAvailableDates(year = dayjs('1/1/2021').year()) {
      const currentCompanyId =
        this.$route.params.id || this.$store.getters['company/getCompanyId']
      this.monthsAvailable = ['loading'] // clear month UI
      this.selectedYear = year
      ChartDataService.getChartData(this, currentCompanyId, this.selectedYear)
      const access = await ChartDataService.userAccessRecord(currentCompanyId)
      this.$store.dispatch('datasetAccess/storeDatasetAccess', access)
    },
  },
}
</script>

<style lang="scss" scoped>
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

.timeframe-selector-wrapper {
  &.chart-unavailable {
    position: absolute;
    top: 0;
    border: solid $color-ellen-dark;
    border-radius: $border-radius;
    background-color: $color-ellen-brand-bright;
    padding: 20px;
    justify-content: flex-start;
    height: 280px;
    padding: 20px;
    justify-content: flex-start;
    margin-top: 40px;
    width: 95%;

    @include breakpoint(medium up) {
      width: 550px; // allow month UI element to peak off the side
      background-color: $color-ellen-brand-bright;
      height: 350px;
    }
  }

  h3 {
    text-align: left;
  }
}

ul.year-select {
  margin: 5px auto;
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;

  @include breakpoint(small only) {
    justify-content: space-evenly;
  }

  > li {
    display: flex;
    align-items: center;
    height: 20px;

    .divider {
      @include breakpoint(small only) {
        display: none;
      }
    }
  }

  > li .year-select-link {
    @extend %heading-font-family;
    font-size: $small-label-font-size;
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

.chart-timeframe-selector {
  display: flex;
  width: 100%;
  overflow: hidden;
}

.months-available-wrapper {
  height: 70px;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  align-items: center;
  transform: translateY(0);

  @include breakpoint(medium up) {
    height: 50px;
    padding-bottom: 10px;
  }

  &.active {
    animation: data-enter-up 1s forwards;
    justify-content: flex-start;
  }

  .data-not-available {
    font-size: 14px;
    color: $color-ellen-dark;
    width: 100%;
    display: flex;
  }
}

.purchase-controls {
  display: flex;
  flex-direction: column;
  width: 100%;

  @include breakpoint(medium up) {
    max-width: 250px;

    .chart-unavailable & {
      max-width: none;
    }
  }

  button {
    margin: 10px 0;
    padding: 20px;
    width: 100%;
    max-width: none;
    line-height: 1;
  }

  .credit-cost {
    font-size: $small-label-font-size;
    display: flex;
    background-color: $color-ellen-brand-bright;
    padding: 2px;
    align-items: center;
    justify-content: center;
  }
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
