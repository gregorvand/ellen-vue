<template>
  <div
    class="date-selector-wrapper"
    :class="{
      selectable: accessibleMonth && !purchaseMode,
      purchasable: !accessibleMonth && purchaseMode,
    }"
  >
    <div class="date-selector">
      <div class="checkbox-spacer" v-if="purchaseMode">
        <label :for="assignID" @click="updateRequestedDates">{{
          readableDate
        }}</label>
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
  data() {
    return {
      // if user has already selected this company, will return true, else false
      dateObject: {
        date: dayjs()
          .set('date', 1)
          .set('month', this.date.date.month - 1)
          .set('year', this.date.year),
      },
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
    ...mapState(['company']),
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
        console.log('no access yet.. purchasing')

        // purchase with credits
        axios({
          method: 'post',
          url: `${process.env.VUE_APP_API_URL}/api/dataset-access/charge`,
          data: {
            companyId: this.company.currentCompany.id,
            datasetId: this.assignID,
          },
        })
          .then((data) => {
            console.log('woo purchased', data)
            const notification = {
              type: 'success',
              message: `Great, you can now access ${this.longerReadableDate}`,
            }
            this.$store.dispatch('notification/add', notification, {
              root: true,
            })
            this.$parent.$emit('data-subscribed')
          })
          .catch((error) => {
            console.log(error.response.status)
            if (error.response.status == 433) {
              const notification = {
                type: 'error',
                message: `Oh no, we were not able to add ${this.longerReadableDate}, you do not have enough credits`,
              }
              this.$store.dispatch('notification/add', notification, {
                root: true,
              })
            }
          })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.date-selector-wrapper {
  // display: none;

  // &.selectable {
  //   display: flex;
  // }

  // .purchase-wrapper & {
  //   &.purchasable {
  //     display: flex;
  //   }
  // }
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
    min-width: 50px;
    width: auto;
    user-select: none;
    background-color: $color-white;
    color: $color-ellen-dark;
    border-color: $color-ellen-dark;
    margin: 0 5px;
  }

  input:checked + label {
    background-color: #6ed6b7;
    color: $color-white;
    border: solid $color-ellen-dark 2px;
  }
}

.purchase-wrapper {
  .date-selector-wrapper.purchasable {
    input + label {
      border-color: red;
    }
  }
}
</style>
