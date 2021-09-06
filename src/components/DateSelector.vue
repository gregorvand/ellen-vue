<template>
  <div>
    <div class="date-selector">
      <span>{{ date.date }}</span>
      <div class="checkbox-spacer">
        <input
          class="select-company"
          type="checkbox"
          v-model="checked"
          @click="updateRequestedDates"
        />
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
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
        this.$store.dispatch(
          'selectedDataSets/addDateToSelection',
          this.dateObject
        )
      } else {
        this.$store.dispatch(
          'selectedDataSets/removeDateSelection',
          this.dateObject
        )
      }
    },
  },
  data() {
    return {
      // if user has already selected this company, will return true, else false
      checked: this.$store.getters['selectedDataSets/userHasSelectedDates'](
        this.date.id
      ),
      dateObject: this.date,
    }
  },
}
</script>

<style lang="scss" scoped></style>
