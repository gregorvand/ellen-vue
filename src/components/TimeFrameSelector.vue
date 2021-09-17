<template>
  <div>
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
    <div class="chart-timeframe-selector">
      <div
        v-if="monthsAvailable[0] != 'loading'"
        class="months-available-wrapper"
        :class="{ active: monthsAvailable.length > 0 }"
      >
        <!-- eventually we want a store of valid months that will generate the buttons -->
        <DateSelector
          v-for="month in monthsAvailable"
          :date="{ date: month, year: selectedYear }"
          :key="month.month + selectedYear"
          :monthIsAccessble="hasAccess"
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

export default {
  components: { DateSelector },
  props: {
    hasAccess: {
      type: Array,
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
      this.monthsAvailable = monthData.data
    },
  },
  watch: {
    '$store.company.currentCompany.id': function (x, y) {
      console.log(x, y)
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
  justify-content: center;
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

    @include breakpoint(medium up) {
      justify-content: center;
    }
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
