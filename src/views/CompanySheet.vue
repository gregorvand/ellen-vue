<template>
  <div class="inner-container max-width">
    <div class="container row">
      <div class="company-sheet-name">
        <h1 v-if="company.nameIdentifier">{{ company.nameIdentifier }}</h1>
        <h4 v-if="company.emailIdentifier">
          {{ companyDomain }}
        </h4>
        <h1 v-else><BaseLoadingSpinner /></h1>
      </div>

      <span v-if="company.ticker">Symbol: {{ company.ticker }}</span>
      <div>
        <span class="key-line"></span>
        <!-- v if company is Edison -->
        <span>Avg orders/day</span>
      </div>
    </div>
    <LineChart
      v-if="!company.ticker"
      :companyId="this.$route.params.id"
      :companyName="company.nameIdentifier"
    />
  </div>
</template>

<script>
import LineChart from '@/components/ChartV2'

export default {
  name: 'CompanyView',
  components: {
    LineChart,
  },

  beforeCreate() {
    this.$store.dispatch('company/fetchCompany', this.$route.params.id)
  },
  computed: {
    company() {
      return this.$store.state.company.currentCompany
    },
    companyDomain() {
      let emailSplit = this.company.emailIdentifier.split('@')
      return emailSplit[1]
    },
  },
}
</script>

<style lang="scss" scoped>
.company-sheet {
  display: flex;
  width: 100%;
  justify-content: flex-start;

  &-name {
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
  }
}
</style>
