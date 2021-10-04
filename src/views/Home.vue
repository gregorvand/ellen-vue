<template>
  <div class="home">
    <p class="home-intro">
      <strong>ELLEN</strong> provides unrivalled retail insights, tools, and
      automatic updates to benchmark your business against market leaders
    </p>

    <section class="home-components">
      <SearchForm :showCheckbox="true" />
      <SelectedCompanies />
      <CategoryList />
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
    CategoryList,
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
  max-width: 700px;

  > *,
  form input {
    border-radius: $border-radius;
  }
}

.search-component {
  background-color: $color-ellen-brand;
  padding: 0 $mobile-padding;
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
