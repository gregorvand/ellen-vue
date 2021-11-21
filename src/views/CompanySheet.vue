<template>
  <div class="inner-container max-width">
    <div class="container row">
      <div class="company-sheet-name">
        <h1 v-if="companyObject.data">
          {{ companyObject.data.nameIdentifier }}
        </h1>
        <h4 v-if="companyObject.data !== undefined">
          {{ companyDomain }} <br />
        </h4>
        <h1 v-else><BaseLoadingSpinner /></h1>
      </div>
      <div>
        <span class="key-line"></span>
        <!-- v if company is Edison -->
        <span>Avg orders/month</span>
      </div>
    </div>
    <LineChart
      v-if="companyObject.data !== undefined"
      :companyObject="companyObject"
    />
  </div>
</template>

<script>
import LineChart from '@/components/ChartV3'
import ChartDataService from '../services/ChartDataService'
// import { computed } from 'vue-demi'

export default {
  name: 'CompanyView',
  components: {
    LineChart,
  },
  data: function () {
    return {
      companyObject: {},
    }
  },
  beforeCreate() {
    ChartDataService.getCompany(this.$route.params.id).then((company) => {
      this.companyObject = company
    })
  },
  computed: {
    companyDomain() {
      let emailSplit = this.companyObject?.data.emailIdentifier.split('@')
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
