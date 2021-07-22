<template>
  <div>
    <h1>Dashboard</h1>
    <ul>
      <li v-for="company in selectedCompanies" :key="company.id">
        <CompanySelector :company="company" v-bind:disableCheckBox="true" />
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
// import { mapState } from 'vuex'
import CompanySelector from '../components/CompanySelector'
export default {
  components: { CompanySelector },
  data() {
    return {
      selectedCompanies: [],
    }
  },
  created() {
    axios
      .get(`${process.env.VUE_APP_API_URL}/api/dashboard`)
      .then(({ data }) => {
        this.selectedCompanies = data.companies
      })
    this.$store.dispatch('selectedCompanies/clearCompanySelection') // ideally state becomes saved companies
  },
}
</script>

<style scoped>
ul {
  width: 100%;
  padding: 0;
  margin: 0;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  max-width: 500px;
}
li {
  list-style: none;
  display: flex;
  width: 100%;
}
</style>
