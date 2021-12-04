<template>
  <div class="home">
    <div class="title-banner-group">
      <h2>eCommerce</h2>
      <h1>Benchmarking & Insights</h1>
    </div>

    <section class="home-components">
      <SearchForm :showCheckbox="true" />
      <h3 class="margin-top">Your selected companies</h3>
      <SelectedCompanies />
      <BaseSaveButton v-if="loggedIn" />

      <p v-if="!loggedIn && selectedCompanies.length">
        Save your company list above and access the insights
      </p>
      <RegisterUser
        v-if="!loggedIn && selectedCompanies.length > 0"
        v-bind:captureName="false"
      />
    </section>
    <section class="full-width-banner brand-banner">
      <span>what are</span
      ><img
        src="@/assets/ELLENv2logo.svg"
        class="logo"
        alt="welcome to ELLEN insights"
      /><span>insights?</span>
    </section>
    <section class="full-width chart-example">
      <img src="@/assets/ellen_chart_example.png" />
    </section>
    <RegisterUser v-if="!loggedIn" v-bind:captureName="false" />
  </div>
</template>

<script>
import { authComputed } from '@/store/helpers.js'
import RegisterUser from '@/views/RegisterUser.vue'
import { mapState } from 'vuex'

import SelectedCompanies from '@/components/SelectedCompanies.vue'
import SearchForm from '@/components/SearchForm.vue'

export default {
  computed: {
    ...authComputed,
    ...mapState('selectedCompanies', ['selectedCompanies']),
  },
  components: {
    SelectedCompanies,
    SearchForm,
    RegisterUser,
  },
}
</script>

<style lang="scss" scoped>
.home-components {
  display: flex;
  flex-direction: column;
  justify-items: center;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  width: 100%;
  > *,
  form input {
    border-radius: $border-radius;
  }
}

.title-banner-group {
  line-height: 1;
  text-align: left;
  width: 100%;
  max-width: $inner-max-width;
  margin: 0 auto;
  margin-top: 20px;
}

.search-component {
  max-width: $inner-max-width;
}

.home-intro {
  padding-top: 10px;
  line-height: 1;
}

.register-form-wrapper {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.brand-banner {
  margin-top: 40px;
  background-color: $color-ellen-brand;
  > * {
    margin: 0 5px;
  }
}

.chart-example {
  @include breakpoint(small only) {
    height: 150vw;
    padding-bottom: 20px;

    > img {
      height: 100%;
    }
  }
}
</style>
