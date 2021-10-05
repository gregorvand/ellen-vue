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
    <h3>View purchased months</h3>
    <div class="chart-timeframe-selector">
      <div
        v-if="monthsAvailable[0] != 'loading'"
        class="months-available-wrapper"
        :class="{ active: monthsAvailable.length > 0 }"
      >
        <DateSelector
          v-for="month in purchasedMonths"
          :date="{ date: month, year: selectedYear }"
          :key="`${month.id}`"
          :monthIsAccessble="hasAccess"
        />
        <span class="data-not-available" v-if="purchasedMonths.length == 0"
          >No purchased months</span
        >
      </div>
      <div v-else class="months-available-wrapper">
        <BaseLoadingSpinner />
      </div>
    </div>

    <h3>Purchase additional months</h3>
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
        />

        <span class="data-not-available" v-if="monthsAvailable.length == 0"
          >No data for this year available</span
        >
      </div>
      <div v-else class="months-available-wrapper">
        <BaseLoadingSpinner />
      </div>
    </div>
    <div class="purchase-controls" v-if="monthsAvailable.length > 0">
      <button :disabled="cartCount < 1" @click="multiPurchase">
        {{ cartCountLabel }}
      </button>
      <span class="credit-cost">{{ creditCost }}</span>
    </div>
  </div>
</template>

<script>
import DateSelector from './DateSelector.vue'
import { mapState } from 'vuex'
import dayjs from 'dayjs'
import axios from 'axios'

import * as dataUtilties from '@/helpers/data_utilities'

export default {
  components: { DateSelector },
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
      yearsChoice: [2017, 2018, 2019, 2020, 2021],
    }
  },
  computed: {
    purchasedMonths() {
      return this.monthsAvailable.filter((month) =>
        this.hasAccess.includes(month.id)
      )
    },
    lockedMonths() {
      return this.monthsAvailable.filter(
        (month) => !this.hasAccess.includes(month.id)
      )
    },
    cartCount() {
      return this.selectedDataSets.datasetCart.length
    },
    cartCountLabel() {
      const cartCount = this.selectedDataSets.datasetCart.length
      const suffix = cartCount > 1 ? 'months' : 'month'
      if (cartCount == 0) {
        return `select months`
      } else {
        return `Purchase ${cartCount} ${suffix}`
      }
    },
    creditCost() {
      const currentCredits = this.$store.getters['credits/currentCredits']
      const cost =
        process.env.VUE_APP_DATASET_COST *
        this.selectedDataSets.datasetCart.length
      return cost <= parseInt(currentCredits)
        ? `This will deduct ${cost} credits`
        : 'not enough credits'
    },
    ...mapState(['company', ['currentCompany'], 'selectedDataSets']),
  },
  created() {
    this.$store.watch((state) => {
      if (state.company.currentCompany.id) {
        this.getAvailableDates()
      }
    })
    this.$store.dispatch('selectedDataSets/clearDatasetCart')
  },
  methods: {
    async getAvailableDates(year = dayjs('1/1/2020').year()) {
      this.$store.dispatch('selectedDataSets/clearDatasetCart')
      const currentCompanyId = this.$store.getters['company/getCompanyId']
      // TODO: remove 2020 after dev
      this.monthsAvailable = ['loading'] // clear month UI
      this.selectedYear = year

      let monthData = await axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}/api/orders/dates-available`,
        data: {
          companyId: currentCompanyId,
          year: year,
        },
      })

      const monthsAvailableExtended = monthData.data.map((aMonth) => ({
        month: aMonth.month,
        count: aMonth.count,
        id: `${dataUtilties.constructDateIdentifier(
          this.$store.state.company.currentCompany.id,
          aMonth.month - 1,
          this.selectedYear
        )}`,
      }))

      this.monthsAvailable = monthsAvailableExtended
    },

    async multiPurchase() {
      let dataToPurchase = await this.$store.getters[
        'selectedDataSets/datasetCart'
      ]

      axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}/api/dataset-access/charge`,
        data: {
          companyId: this.$store.getters['company/getCompanyId'],
          datasetIdArray: dataToPurchase,
        },
      })
        .then((datasets) => {
          this.$emit('data-subscribed')
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
  // border: solid black thin;
  align-items: center;
  transform: translateY(0);

  @include breakpoint(medium up) {
    height: 50px;
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
  }

  button {
    margin: 10px 0;
    padding: 20px;
    width: 100%;
    max-width: none;
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
