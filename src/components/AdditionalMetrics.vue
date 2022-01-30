<template>
  <div>
    <div class="datapoint-row">
      <h4 class="small-label">
        AVG ORDER VALUE (Trailing {{ aov.trailing }} months)
      </h4>
      <div v-if="aov.message">{{ aov.message }}</div>
      <div v-else class="aov">
        US$ {{ parseFloat(aov.aov_value).toFixed(2) }}
      </div>
    </div>
    <div class="datapoint-row">
      <h4 class="small-label">
        AVG FREQ. PER USER (Orders/customer over 4 months)
      </h4>
      <div v-if="act.message">{{ act.message }}</div>
      <div v-else class="aov">{{ act.act_value }}</div>
    </div>
    <div class="datapoint-row">
      <h4 class="small-label">TOP SKUS</h4>
      <div>Coming Soon</div>
    </div>
    <div class="datapoint-row">
      <h4 class="small-label">AVG UNITS PER ORDER</h4>
      <div>Coming Soon</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    companyObject: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState('datapoints', ['aov', 'act']),
  },
  methods: {
    getAov() {
      this.$store.dispatch(
        'datapoints/fetchAov',
        this.companyObject.data.emailIdentifier
      )
    },
    getAct() {
      this.$store.dispatch(
        'datapoints/fetchAct',
        this.companyObject.data.emailIdentifier
      )
    },
  },
  created() {
    this.getAov()
    this.getAct()
  },
}
</script>

<style lang="scss" scoped>
.datapoint-row {
  display: flex;
  flex-direction: column;
  text-align: left;
  align-items: flex-start;
  justify-content: flex-start;
  border-bottom: solid $color-ellen-dark-gray 1px;
  max-width: 400px;
  padding: 10px 0;
  margin-bottom: 5px;

  @include breakpoint(small only) {
    padding: 10px;
  }

  > h4 {
    text-align: left;
    color: $color-ellen-dark;
  }

  .aov {
    text-transform: capitalize;
  }
}
</style>
