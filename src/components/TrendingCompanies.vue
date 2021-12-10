<template>
  <ul class="trending-companies">
    <li v-for="company in trendingCompanies" :key="company.id">
      <CompanySelector :company="company" />
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import CompanySelector from '../components/CompanySelector'

export default {
  components: { CompanySelector },
  computed: {
    ...mapState('followedCompanies', ['followedCompanies']),
  },
  data: function () {
    return {
      trendingCompanies: [],
    }
  },
  created() {
    axios
      .get(`${process.env.VUE_APP_API_URL}/api/trending-companies`)
      .then(({ data }) => {
        this.trendingCompanies = data
      })
  },
}
</script>

<style lang="scss" scoped>
.trending-companies {
  display: grid;
  grid-template-columns: 1fr 1fr;

  .company-selector {
    width: auto;
  }

  @include breakpoint(medium up) {
    grid-template-columns: 1fr 1fr 1fr;

    // align widths of 3-across with the search bar etc
    .company-selector {
      width: 226px;
    }
  }

  li {
    height: 50px;
    margin: 5px;
  }
}
</style>
