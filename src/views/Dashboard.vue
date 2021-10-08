<template>
  <div>
    <section class="inner-container">
      <div class="container upper dashboard no-padding">
        <h1>WELCOME TO</h1>
        <img
          src="@/assets/ELLENv2logo.svg"
          class="logo"
          alt="welcome to ELLEN insights"
        />
        <p>Tools and insights for your next business move</p>
        <SearchForm :showCheckbox="true" />
      </div>
      <div class="container upper graphic">
        <img
          src="@/assets/investment_chart_graphic.svg"
          class="graphic"
          alt="welcome to ELLEN insights"
        />
      </div>
    </section>
    <section class="container lower">
      <div class="inner-container">
        <div class="dashboard left inner-container">
          <h2>FOLLOWED PRIVATE COMPANIES</h2>
          <ul class="followed-companies" ref="scrollingEl">
            <li v-for="company in filteredPrivateCompanies" :key="company.id">
              <CompanySelector
                :company="company"
                v-bind:disableCheckBox="true"
              />
            </li>
          </ul>
        </div>
        <div class="dashboard right inner-container">
          <h2>FOLLOWED PUBLIC COMPANIES</h2>
          <ul class="followed-companies" ref="scrollingEl">
            <li v-for="company in filteredPublicCompanies" :key="company.id">
              <CompanySelector
                :company="company"
                v-bind:disableCheckBox="true"
              />
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'
import CompanySelector from '../components/CompanySelector'
import SearchForm from '@/components/SearchForm'

export default {
  components: { CompanySelector, SearchForm },
  data() {
    return {
      selectedCompanies: [],
    }
  },
  created() {
    axios
      .post(`${process.env.VUE_APP_API_URL}/api/dashboard`)
      .then(({ data }) => {
        this.$store.dispatch(
          'followedCompanies/addAllFollowedCompanies',
          data.companies
        )
      })
    this.$store.dispatch('selectedCompanies/clearCompanySelection') // ideally state becomes saved companies
  },
  computed: {
    filteredPrivateCompanies() {
      return this.followedCompanies.filter((company) => !company.ticker)
    },
    filteredPublicCompanies() {
      return this.followedCompanies.filter((company) => company.ticker)
    },
    ...mapState('followedCompanies', ['followedCompanies']),
  },
}
</script>

<style scoped lang="scss">
.container {
  min-height: 300px;
  flex-direction: row;

  &.lower {
    border-top: black dotted 1px;
    border-bottom: black dotted 1px;
    padding: 10px;
    margin-top: 20px;
  }

  &.upper {
    justify-content: center;
  }

  &.graphic {
    display: none;
    align-items: center;

    @include breakpoint(medium up) {
      display: flex;
    }
  }
}

.inner-container {
  flex-direction: column;
  min-height: 200px;

  @include breakpoint(medium up) {
    flex-direction: row;
  }
}

.dashboard {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  img {
    &.logo {
      width: 115px;
    }
    &.graphic {
      width: 100%;
      max-width: 400px;
    }
  }
  h1,
  p {
    font-size: $small-label-font-size;
  }

  h2 {
    @extend %subheading;
    text-align: left;
  }
}
.search-component {
  padding-right: 20px;
}

.followed-companies {
  flex-direction: column;
  overflow-y: scroll;
  justify-content: flex-start;
  height: 300px;
  width: 100%;
  padding: 20px 20px 0 0;

  .company-selector {
    width: 100%;
  }
}
</style>
