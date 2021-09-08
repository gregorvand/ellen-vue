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
  methods: {
    async updateRequestedDates() {
      // take in object
      // convert date format
      // pass to store
      if (!this.checked) {
        let dateForStore = dayjs(this.date.date).toISOString()
        this.dateObject.date = dateForStore
        this.$store.dispatch('selectedDataSets/addDateToSelection', {
          date: this.dateObject,
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
  data() {
    return {
      // if user has already selected this company, will return true, else false
      dateObject: this.date,
      readableDate: dayjs(this.date.date).format('MMM YY'),
    }
  },
  computed: {
    assignID() {
      return `${this.company.currentCompany.id}${dayjs(this.date.date).format(
        'MMDDYYYY'
      )}`
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
}
</script>

<style lang="scss" scoped>
.date-selector {
  margin: 0 5px;
  input {
    display: none;

    + label {
      @extend .btn;
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
