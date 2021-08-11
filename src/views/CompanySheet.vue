<template>
  <div>
    <div class="company-sheet-ticker">
      <div class="company-sheet-name">
        <h1>{{ company.nameIdentifier }}</h1>
      </div>
      <span v-if="company.ticker !== ''">Symbol: {{ company.ticker }}</span>
    </div>
    <template v-if="publicData && company.ticker">
      <div>
        <ul>
          <li>{{ publicData.symbol }}</li>
          <li>{{ publicData.date }}</li>
          <li>{{ publicData.period }}</li>
          <li>ROA: {{ publicData.returnOnAssets }}</li>
        </ul>
      </div>
    </template>
    <div v-else>
      <span v-if="company.ticker">Getting public data...</span>
    </div>
    <LineChart
      v-if="!company.ticker"
      :companyId="this.$route.params.id"
      :companyName="company.nameIdentifier"
    />
    <ul>
      <li>More info...</li>
      <li>More info...</li>
      <li>More info...</li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LineChart from '@/components/Chart'

export default {
  name: 'CompanyView',
  components: {
    LineChart,
  },

  beforeCreate() {
    this.$store.dispatch('company/fetchCompany', this.$route.params.id)
  },
  // mounted() {
  //   this.$store
  //     .dispatch(
  //       'company/fetchPublicCompanyRatios',
  //       this.$store.getters['company/getCompanyTicker']
  //     )
  //     .finally(() => (this.loading = false))
  // },
  computed: mapState({
    company: (state) => state.company.currentCompany,
    publicData: (state) => state?.company?.publicData[0],
  }),
}
</script>

<style lang="scss" scoped>
h1 {
  margin: 20px;
  font-size: 20px;
}
</style>
