<template>
  <div class="home">
    <h1>Ellen Insights v2</h1>
    <div v-if="!loggedIn">
      For dashboard access please
      <router-link to="/login"> Login </router-link>
      or
      <router-link to="/register"> Register </router-link>
    </div>

    <section class="home-components">
      <SelectedCompanies />
      <SearchForm />
      <CategoryList />
      <BaseSaveButton v-if="loggedIn" />
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

<style scoped lang="scss">
.home-components {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  justify-items: center;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  justify-items: center;
  align-items: center;
  width: 100%;
}
</style>
