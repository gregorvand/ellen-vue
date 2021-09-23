<template>
  <div class="timeframe-selector-wrapper">
    <div>Select year</div>
    <ul class="year-select">
      <li
        v-for="year in yearsChoice"
        :key="year"
        @click="getAvailableDates(year)"
        :class="{ active: selectedYear == year }"
      >
        {{ year }}
      </li>
    </ul>
    <h3>Timeframe</h3>
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
    ...mapState('company', ['currentCompany']),
  },
  created() {
    this.$store.watch((state) => {
      if (state.company.currentCompany.id) {
        this.getAvailableDates()
      }
    })
  },
  methods: {
    async getAvailableDates(year = dayjs('1/1/2020').year()) {
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
  margin: 10px auto;
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  > li {
    @extend %heading-font-family;
    font-size: 11px;
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

  .data-not-available {
    font-size: 11px;
    color: $color-ellen-dark;
    width: 100%;
  }
}

.months-available-wrapper {
  height: 50px;
  display: flex;
  justify-content: flex-start;
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  padding: 10px;
  // border: solid black thin;
  align-items: center;
  transform: translateY(0);

  &.active {
    animation: data-enter-up 1s forwards;
    justify-content: flex-start;
  }
}

button {
  margin: 10px;
  padding: 20px;
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
