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
        })
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
      id: this.assignID,
    }
  },
  computed: {
    assignID() {
      return Math.random(10)
    },
    ...mapState(['company']),
  },
}
</script>

<style lang="scss" scoped></style>
