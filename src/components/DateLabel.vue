<template>
  <div v-if="dateID">
    <div class="date-selector-wrapper">
      <div class="date-selector">
        <div class="checkbox-spacer">
          <input
            :id="dateID"
            class="select-company"
            type="checkbox"
            @click="updateRequestedDates"
          />
          <label :for="dateID">{{ readableMonth }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapState } from 'vuex'

import * as dataUtilties from '@/helpers/data_utilities'

export default {
  props: {
    dateID: {
      type: String,
    },
    purchaseMode: {
      type: Boolean,
    },
  },
  data() {
    return {
      // if user has already selected this company, will return true, else false
      toPurchase: [],
    }
  },
  computed: {
    monthDigit() {
      return this.dateID.substr(-8).substring(0, 2) - 1
    },
    readableMonth() {
      return dayjs().month(this.monthDigit).format('MMMM')
    },
    ...mapState(['company', 'selectedDataSets']),
  },
  methods: {
    // if already part of active chartData dataset, do nothing
    // to get the currently active datasets we need to do what ChatV2.vue
    // is doing and get store.state.selectedDataSets.currentDataSets and then
    // filter them down to those that are 'active' already and load accessible months
    // not already active
    async updateRequestedDates() {
      if (this.accessibleMonth) {
        // take in object
        // convert date format
        // pass to store
        const dateToStore = dayjs(this.dateObject.date).toISOString()
        if (!this.checked) {
          this.$store.dispatch('selectedDataSets/addDateToSelection', {
            date: { date: dateToStore },
            company: this.company.currentCompany.id,
            id: this.assignID,
          })
        } else {
          this.$store.dispatch(
            'selectedDataSets/removeDateSelection',
            this.assignID
          )
          this.$store.dispatch(
            'selectedDataSets/deactivateDataSet',
            this.assignID
          )
        }
      }
    },
    async addToCart() {
      this.selectedDataSets.datasetCart.includes(this.assignID)
        ? this.$store.dispatch(
            'selectedDataSets/removeDatasetFromCart',
            this.assignID
          )
        : this.$store.dispatch(
            'selectedDataSets/addDatasetToCart',
            this.assignID
          )
    },
  },
}
</script>

<style lang="scss" scoped>
.date-selector-wrapper {
  &:first-of-type {
    .date-selector {
      margin-left: 0;
    }
  }

  &.purchasable {
    .date-selector {
      width: 80px;
      height: 20px;
      background-color: $color-ellen-light-gray;
      margin-right: 10px;
      position: relative;

      .no-access-lock-img {
        position: absolute;
        top: -10px;
        right: -7px;
      }

      .purchase-selector {
        display: flex;
      }

      input {
        display: flex;
        height: 18px;
        width: 18px;
        margin-left: 10px;
      }

      label {
        background-color: $color-ellen-light-gray;
        border: solid transparent 2px;
      }
    }
  }
}

.date-selector {
  margin: 0 5px;

  input {
    display: none;
  }

  label {
    // @extend .btn;
    min-width: 80px;
    width: auto;
    user-select: none;
    background-color: $color-ellen-brand-bright;
    color: $color-ellen-dark;
    margin: 0;
    width: 100%;
    padding: 10px;
  }
}
</style>
