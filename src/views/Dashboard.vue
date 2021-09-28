<template>
  <div>
    <h1>Dashboard</h1>
    <ul class="followed-companies">
      <h2>Followed companies</h2>
      <li v-for="company in selectedCompanies" :key="company.id">
        <CompanySelector :company="company" v-bind:disableCheckBox="true" />
      </li>
    </ul>
    <PaymentsSubscription />
    <!-- <Payments /> -->
  </div>
</template>

<script>
import axios from 'axios'
// import { mapState } from 'vuex'
import CompanySelector from '../components/CompanySelector'
// import Payments from '../components/Payments'
import PaymentsSubscription from '../components/PaymentsSubscription'

export default {
  components: { CompanySelector, PaymentsSubscription },
  data() {
    return {
      selectedCompanies: [],
    }
  },
  created() {
    axios
      .post(`${process.env.VUE_APP_API_URL}/api/dashboard`)
      .then(({ data }) => {
        this.selectedCompanies = data.companies
      })
    this.$store.dispatch('selectedCompanies/clearCompanySelection') // ideally state becomes saved companies
  },
}
</script>

<style scoped lang="scss">
ul {
  width: 100%;
  padding: 0;
  margin: 0;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 0 20px;
  height: 250px;
  overflow-y: scroll;
  max-width: 500px;
  border: solid $color-black thin;
}
li {
  list-style: none;
  display: flex;
  width: 100%;
}
</style>
