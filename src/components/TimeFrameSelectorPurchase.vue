<template>
  <div
    class="timeframe-selector-wrapper container"
    :class="{ 'chart-unavailable': hasAccess.length == 0 }"
  >
    <h3>View Year</h3>
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
    <h3>Purchase months</h3>
    <div class="chart-timeframe-selector">
      <div
        v-if="monthsAvailable[0] != 'loading'"
        class="months-available-wrapper"
        :class="{ active: monthsAvailable.length > 0 }"
      >
        <DateSelector
          v-for="month in lockedMonths"
          :date="{ date: month, year: selectedYear }"
          :key="`${month.id}`"
          :monthIsAccessble="hasAccess"
          :purchaseMode="true"
          :companyId="companyId"
        />

        <span class="data-not-available" v-if="monthsAvailable.length == 0"
          >No data for this year available</span
        >

        <span
          class="data-not-available"
          v-if="monthsAvailable.length > 0 && lockedMonths.length == 0"
          >You have access to all available data for this year</span
        >
      </div>
      <div v-else class="months-available-wrapper">
        <BaseLoadingSpinner />
      </div>
    </div>
    <div class="purchase-controls" v-if="monthsAvailable.length > 0">
      <button :disabled="cartCount < 1 || !creditCost" @click="multiPurchase">
        {{ cartCountLabel }}
      </button>
      <span class="credit-cost" v-if="creditCost != false">{{
        creditCost
      }}</span>
      <div class="credit-cost" v-else>
        Not enough credits -
        <router-link :to="{ name: 'dashboard' }">Buy more </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import DateSelector from './DateSelector.vue'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import axios from 'axios'
import pluralize from 'pluralize'
import ChartDataService from '../services/ChartDataService'

import * as dataUtilties from '@/helpers/data_utilities'

export default {
  components: { DateSelector },
  props: {
    purchaseMode: {
      type: Boolean,
    },
    emailIdentifier: {
      type: String,
    },
    companyId: {
      type: Number,
    },
  },
  data: function () {
    return {
      selectedYear: '', // set initially by getAccessibleDataset
      monthsAvailable: [],
      yearsChoice: [2015, 2016, 2017, 2018, 2019, 2020, 2021],
    }
  },
  computed: {
    purchasedMonths() {
      return this.monthsAvailable.filter((month) =>
        this.hasAccess.includes(month.id)
      )
    },
    lockedMonths() {
      const currentCompanyId =
        this.$route.params.id || this.$store.getters['company/getCompanyId']
      let companyDataSets = this.accessIDsByCompany.filter((dataset) => {
        return dataset.companyId == currentCompanyId
      })

      return (
        this.monthsAvailable.filter(
          (month) =>
            !companyDataSets[companyDataSets.length - 1]?.datasetIds.includes(
              month.id
            )
        ) || this.monthsAvailable
      )
    },
    cartCount() {
      return this.selectedDataSets.datasetCart.length
    },
    cartCountLabel() {
      const cartCount = this.selectedDataSets.datasetCart.length
      if (cartCount == 0) {
        return `select months`
      } else if (this.creditCost) {
        return `Purchase ${cartCount} ${pluralize('month', cartCount)}`
      } else {
        return 'Remove an item or buy more credits'
      }
    },
    creditCost() {
      const currentCredits = this.$store.getters['credits/currentCredits']
      const cost =
        process.env.VUE_APP_DATASET_COST *
        this.selectedDataSets.datasetCart.length
      return cost <= parseInt(currentCredits)
        ? `This will deduct ${cost} credits`
        : false
    },
    hasAccess() {
      const currentCompanyId =
        this.$route.params.id || this.$store.getters['company/getCompanyId']
      return this.accessIDsByCompany.filter((dataset) => {
        return dataset.companyId == currentCompanyId
      })
    },
    ...mapState(['company', ['currentCompany'], 'selectedDataSets']),
    ...mapState('datasetAccess', ['accessIDsByCompany']),
  },
  created() {
    this.getAccess()
    this.getAvailableDates()
    this.$store.dispatch('selectedDataSets/clearDatasetCart')
  },
  methods: {
    async getAvailableDates(year = dayjs('1/1/2021').year()) {
      this.$store.dispatch('selectedDataSets/clearDatasetCart')
      const currentCompanyId =
        this.$route.params.id || this.$store.getters['company/getCompanyId']
      this.monthsAvailable = ['loading'] // clear month UI
      this.selectedYear = year

      ChartDataService.getChartData(
        this,
        currentCompanyId,
        this.emailIdentifier,
        this.selectedYear
      )

      let monthData = await axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}/api/orders/dates-available`,
        data: {
          companyId: currentCompanyId,
          year: year,
          identifier: this.emailIdentifier,
        },
      })

      const monthsAvailableExtended = monthData.data.map((aMonth) => ({
        month: aMonth.month,
        count: aMonth.count,
        id: `${dataUtilties.constructDateIdentifier(
          this.companyId,
          aMonth.month - 1,
          this.selectedYear
        )}`,
      }))

      this.monthsAvailable = monthsAvailableExtended
    },

    async getAccess() {
      const currentCompanyId =
        this.$route.params.id || this.$store.getters['company/getCompanyId']
      ChartDataService.getChartData(
        this,
        currentCompanyId,
        this.emaildentifier,
        this.selectedYear
      )
      const access = await ChartDataService.userAccessRecord(currentCompanyId)

      if (access.data.length > 0) {
        this.$store.dispatch('datasetAccess/storeDatasetAccess', access)
      }
      return access
    },

    async multiPurchase() {
      let dataToPurchase = await this.$store.getters[
        'selectedDataSets/datasetCart'
      ]

      axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}/api/dataset-access/charge`,
        data: {
          companyId: this.companyId,
          datasetIdArray: dataToPurchase,
        },
      })
        .then(async (datasets) => {
          ChartDataService.getChartData(
            this,
            this.company.currentCompany.id,
            this.emailIdentifier,
            this.selectedYear
          )
          this.$store.dispatch('selectedDataSets/clearDatasetCart')

          const addedData = datasets.data
          const suffix = addedData.length > 1 ? 'months' : 'month'
          const notification = {
            type: 'success',
            message: `📈 Added ${addedData.length} ${suffix} `,
          }
          this.$store.dispatch('notification/add', notification, {
            root: true,
          })
          this.$emit('data-subscribed')
          this.getAccess()
          this.$store.dispatch('credits/fetchBalance')
          this.getAvailableDates(this.selectedYear)
        })
        .catch((error) => {
          if (error.response.status == 433) {
            const notification = {
              type: 'error',
              message: 'Not enough credits',
            }
            this.$store.dispatch('notification/add', notification, {
              root: true,
            })
          }
        })
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
