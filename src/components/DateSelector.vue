<template>
  <div class="date-selector-wrapper" :class="{ visible: accessibleMonth }">
    <div class="date-selector" :class="{ accessible: accessibleMonth }">
      <div class="checkbox-spacer">
        <input
          v-if="accessibleMonth"
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
export default {
  props: {
    date: {
      type: Object,
      default: () => ({}),
    },
    monthIsAccessble: {
      type: Array,
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
      return `${this.company.currentCompany.id}${this.dateObject.date.format(
        'MMDDYYYY'
      )}`
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
    accessibleMonth() {
      return this.monthIsAccessble.includes(this.assignID)
    },
    checked: {
      get() {
        return this.$store.getters['selectedDataSets/userHasSelectedDates'](
          this.assignID
        )
      },
      set() {
        return 'false'
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
        console.log('no access yet')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.date-selector-wrapper {
  display: none;
  &.visible {
    display: flex;
  }
}
.date-selector {
  margin: 0 5px;
  opacity: 0.3;

  &.accessible {
    opacity: 1;
  }
  input {
    display: none;

    + label {
      @extend .btn;
      min-width: 50px;
      width: auto;
      user-select: none;
      background-color: $color-white;
      color: $color-ellen-dark;
      border-color: $color-ellen-dark;
      margin: 0 5px;
    }

    &:hover + label {
      background-color: $color-ellen-brand-bright;
    }
  }

  input:checked + label {
    background-color: #6ed6b7;
    color: $color-white;
    border: solid $color-ellen-dark 2px;
  }
}
</style>
