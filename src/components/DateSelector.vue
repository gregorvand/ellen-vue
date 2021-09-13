<template>
  <div>
    <div class="date-selector">
      <div class="checkbox-spacer">
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
export default {
  props: {
    date: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    // console.log(
    //   dayjs()
    //     .set('date', 1)
    //     .set('month', this.date.date.month)
    //     .set('year', '2020')
    //     .toISOString()
    // )
    // console.log(this.thisMonth)
    return {
      // if user has already selected this company, will return true, else false
      dateObject: {
        date: dayjs()
          .set('date', 1)
          .set('month', this.date.date.month - 1)
          .set('year', '2020'),
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
        .set('year', '2020')
        .format('DD/MM/YYYY')
    },
    readableDate() {
      return this.dateObject.date.format('MMM')
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
      // take in object
      // convert date format
      // pass to store
      const dateToStore = dayjs(this.dateObject.date).toISOString()
      console.log(dateToStore)
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
    },
  },
}
</script>

<style lang="scss" scoped>
.date-selector {
  margin: 0 5px;
  input {
    display: none;

    + label {
      @extend .btn;
      min-width: 50px;
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
