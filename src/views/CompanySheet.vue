<template>
  <div>
    <div class="company-sheet-ticker">
      <div class="company-sheet-name">
        <h1 v-if="company.nameIdentifier">{{ company.nameIdentifier }}</h1>
        <h1 v-else><BaseLoadingSpinner /></h1>
      </div>
      <span v-if="company.ticker">Symbol: {{ company.ticker }}</span>
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LineChart from '@/components/ChartV2'

export default {
  name: 'CompanyView',
  components: {
    LineChart,
  },

  beforeCreate() {
    this.$store.dispatch('company/fetchCompany', this.$route.params.id)
  },
  computed: mapState({
    company: (state) => state.company.currentCompany,
    publicData: (state) => state?.company?.publicData[0],
  }),
}
</script>

<style lang="scss" scoped>
h1 {
  margin: 5px;
  font-size: 20px;
  height: 30px;
}
</style>
