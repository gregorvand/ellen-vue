<template>
  <div class="home">
    <div class="title-banner-group">
      <h1>eCommerce</h1>
      <h2>Benchmarking & Insights</h2>
    </div>

    <section class="home-components">
      <SearchForm :showCheckbox="true" />
      <SelectedCompanies />
      <BaseSaveButton v-if="loggedIn" />

      <p v-if="!loggedIn">Now we just need a couple of details</p>
      <RegisterUser v-if="!loggedIn" v-bind:captureName="false" />
    </section>
  </div>
</template>

<script>
import { authComputed } from '@/store/helpers.js'
import RegisterUser from '@/views/RegisterUser.vue'

import SelectedCompanies from '@/components/SelectedCompanies.vue'
import SearchForm from '@/components/SearchForm.vue'
import CategoryList from '@/components/CategoryList.vue'

export default {
  computed: {
    ...authComputed,
  },
  components: {
    SelectedCompanies,
    SearchForm,
    RegisterUser,
  },
}
</script>

<style lang="scss" scoped>
$outer-max-width: 1024px;
$inner-max-width: 700px;
.home-components {
  display: flex;
  flex-direction: column;
  justify-items: center;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  width: 100%;
  max-width: $outer-max-width;

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
  padding: 0 $mobile-padding;
  margin: 0 auto;
  margin-top: 20px;
}

.search-component {
  padding: 0 $mobile-padding;
  max-width: $inner-max-width;
}

.home-intro {
  padding-top: 10px;
  line-height: 1;
}

.register-form-wrapper {
  width: 100%;
  padding: $mobile-padding;
  background-color: $color-ellen-light-gray;
}
</style>
