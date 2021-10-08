<template>
  <div>
    <section class="container">
      <div class="inner-container">
        <div class="dashboard left inner-container">
          <h1>WELCOME TO</h1>
          <img
            src="@/assets/ELLENv2logo.svg"
            class="logo"
            alt="welcome to ELLEN insights"
          />
          <p>Tools and insights for your next business move</p>
          <SearchForm :showCheckbox="true" />
          <ul class="followed-companies">
            <h2>MY FOLLOWED COMPANIES</h2>
            <li v-for="company in selectedCompanies" :key="company.id">
              <CompanySelector
                :company="company"
                v-bind:disableCheckBox="true"
              />
            </li>
          </ul>
        </div>
        <div class="dashboard right inner-container"></div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
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
        this.selectedCompanies = data.companies
      })
    this.$store.dispatch('selectedCompanies/clearCompanySelection') // ideally state becomes saved companies
  },
}
</script>

<style scoped lang="scss">
.container {
  border: solid red thin;
  min-height: 300px;
  flex-direction: row;

  .inner-container {
    min-height: 200px;
  }
}

.dashboard {
  display: flex;
  flex-direction: column;

  &.left {
    justify-content: flex-start;
    align-items: flex-start;
    img {
      width: 115px;
    }
    h1,
    p {
      font-size: $small-label-font-size;
    }
  }

  h2 {
    @extend %subheading;
    text-align: left;
  }
}
</style>
