<template>
  <div
    class="date-selector-wrapper"
    :class="{
      selectable: accessibleMonth && !purchaseMode,
      purchasable: !accessibleMonth && purchaseMode,
    }"
  >
    <div class="date-selector">
      <img
        v-if="purchaseMode"
        class="no-access-lock-img"
        src="@/assets/lock.png"
        alt="no access"
      />
      <div class="purchase-selector" v-if="purchaseMode">
        <label :for="assignID">
          {{ readableDate }}

          <input :id="assignID" type="checkbox" @click="addToCart" />
        </label>
      </div>
      <div class="checkbox-spacer" v-else>
        <input
          :id="assignID"
          class="select-company"
          type="checkbox"
          v-model="checked"
          @click="updateRequestedDates"
        />
        <label :for="assignID">{{ readableDate }}</label>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapState } from 'vuex'
import axios from 'axios'

import * as dataUtilties from '@/helpers/data_utilities'

export default {
  props: {
    date: {
      type: Object,
      default: () => ({}),
    },
    monthIsAccessble: {
      type: Array,
    },
    purchaseMode: {
      type: Boolean,
    },
  },
  mounted() {
    // TODO: experimental. Does this lock up the server?
    this.updateRequestedDates()
  },
  data() {
    return {
      // if user has already selected this company, will return true, else false
      dateObject: {
        date: dayjs()
          .set('date', 1)
          .set('month', this.date.date.month - 1)
          .set('year', this.date.year),
      },
      toPurchase: [],
    }
  },
  computed: {
    assignID() {
      return dataUtilties.assignDateIdentifier(
        this.company.currentCompany.id,
        this.dateObject.date
      )
    },
    formattedDate() {
      return dayjs()
        .set('date', 1)
        .set('month', this.date.date.month)
        .set('year', this.date.year)
        .format('DD/MM/YYYY')
    },
    readableDate() {
      return this.dateObject.date.format('MMM')
    },
    longerReadableDate() {
      return this.dateObject.date.format('MMMM')
    },
    accessibleMonth() {
      return this.monthIsAccessble.includes(this.assignID)
    },
    cartCount() {
      return this.selectedDataSets.datasetCart.length
    },
    checked: {
      get() {
        return this.$store.getters['selectedDataSets/userHasSelectedDates'](
          this.assignID || false
        )
      },
      set() {
        return false
      },
    },
    ...mapState(['company', 'selectedDataSets']),
  },
  methods: {
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
      } else {
        // purchase with credits
        // axios({
        //   method: 'post',
        //   url: `${process.env.VUE_APP_API_URL}/api/dataset-access/charge`,
        //   data: {
        //     companyId: this.company.currentCompany.id,
        //     datasetIdArray: [this.assignID],
        //   },
        // })
        //   .then(() => {
        //     const notification = {
        //       type: 'success',
        //       message: `Great, you can now access ${this.longerReadableDate}`,
        //     }
        //     this.$store.dispatch('notification/add', notification, {
        //       root: true,
        //     })
        //     this.$parent.$emit('data-subscribed')
        //   })
        //   .catch((error) => {
        //     if (error.response.status == 433) {
        //       const notification = {
        //         type: 'error',
        //         message: `Not able to add ${this.longerReadableDate}, you do not have enough credits`,
        //       }
        //       this.$store.dispatch('notification/add', notification, {
        //         root: true,
        //       })
        //     }
        //   })
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

    &:hover + label {
      background-color: $color-ellen-brand-bright;
    }
  }

  label {
    @extend .btn;
    min-width: 80px;
    width: auto;
    user-select: none;
    background-color: $color-ellen-brand-bright;
    color: $color-ellen-dark;
    margin: 0;
    width: 100%;
  }

  input:checked + label {
    color: $color-ellen-brand-dark;
    border: solid $color-ellen-dark 2px;
  }
}
</style>
