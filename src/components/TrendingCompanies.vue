<template>
  <div class="trending-companies">
    <h3>Trending Companies</h3>
    <ul class="trending-companies list">
      <li v-for="company in trendingCompanies" :key="company.id">
        <CompanySelector :company="company" />
      </li>
    </ul>
  </div>
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
        let searchFormatCompany = data.map((company) => {
          return {
            companyEmail: company.emailIdentifier,
            companyIndustry: company.industry,
            companyName: company.nameIdentifier,
            id: company.id,
          }
        })
        this.trendingCompanies = searchFormatCompany
      })
  },
}
</script>

<style lang="scss" scoped>
.trending-companies {
  margin: 0 auto $global-margin auto;

  @include breakpoint(medium up) {
    margin: $global-margin auto;
  }

  &.list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;

    .company-selector {
      width: auto;
    }

    @include breakpoint(medium up) {
      grid-template-columns: 1fr 1fr 1fr;
      height: 90px;

      .additional-metrics & {
        grid-template-columns: 1fr 1fr;
      }

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

  .additional-metrics & {
    h3 {
      display: none;
    }
  }
}
</style>
