<template>
  <div class="home">
    <HomeHero />

    <section class="home-components">
      <h2>Search from thousands of eCommerce companies</h2>
      <SearchForm :showCheckbox="true" />
      <SelectedCompanies v-if="!loggedIn && selectedCompanies.length > 0" />
      <BaseSaveButton v-if="loggedIn" />

      <p v-if="!loggedIn && selectedCompanies.length">
        Save your company list above and access the insights
      </p>

      <RegisterUser
        v-if="!loggedIn && selectedCompanies.length > 0"
        v-bind:captureName="false"
      />
    </section>
    <section>
      <TrendingCompanies />
    </section>
    <section class="full-width">
      <MarketingBlocks />
    </section>

    <section class="final-register">
      <div v-if="!loggedIn">
        <h2>Sign Up to start accessing our insights</h2>
        <p>
          We will add 10 credits of data (10 months, any company) in your
          account when you sign up. <br />
          No card needed.
        </p>
      </div>
      <RegisterUser v-if="!loggedIn" v-bind:captureName="false" />
    </section>
  </div>
</template>

<script>
import { authComputed } from '@/store/helpers.js'
import RegisterUser from '@/views/RegisterUser.vue'
import { mapState } from 'vuex'

import HomeHero from '@/components/HomeHero.vue'
import SelectedCompanies from '@/components/SelectedCompanies.vue'
import TrendingCompanies from '@/components/TrendingCompanies.vue'
import SearchForm from '@/components/SearchForm.vue'
import MarketingBlocks from '@/components/MarketingBlocks.vue'

export default {
  data: function () {
    return {
      patternProps: {
        backgroundImage: `url(${require('@/assets/ellen_pattern.svg')})`,
      },
    }
  },
  computed: {
    ...authComputed,
    ...mapState('selectedCompanies', ['selectedCompanies']),
  },
  components: {
    HomeHero,
    SelectedCompanies,
    SearchForm,
    RegisterUser,
    TrendingCompanies,
    MarketingBlocks,
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
  margin-top: 40px;
  > *,
  form input {
    border-radius: $border-radius;
  }
}

.title-banner-group {
  line-height: 1;
  text-align: center;
  width: 100%;
  max-width: $inner-max-width;
  margin: 0 auto;
  margin-top: 20px;

  @include breakpoint(medium up) {
    text-align: left;
  }
}

.search-component {
  max-width: $inner-max-width;

  @include breakpoint(small only) {
    padding: 10px;
  }
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
    padding-bottom: 20px;

    > img {
      height: 100vw;
    }
  }
}

.insights-list {
  height: 30px;
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
  max-width: 750px;
  margin: 0 auto;

  li {
    display: flex;
    flex-direction: row;
  }
  img,
  span {
    margin: 5px 5px 0;
    display: flex;
  }

  @include breakpoint(medium up) {
    grid-template-columns: 1fr 1fr;
  }

  &-wrapper {
    height: 300px;
    position: relative;

    .pattern-background {
      background-size: 250%;

      @include breakpoint(medium up) {
        background-size: 250%;
      }
    }

    @include breakpoint(medium up) {
      height: 200px;
      padding: 20px;
    }

    h3 {
      padding: 15px;
    }
  }
}

.final-register {
  width: 100%;
  padding: 20px 0;

  .register-form-wrapper {
    width: 100%;
    max-width: unset;
  }

  p {
    font-size: 14px;
  }
}

.full-width-banner {
  height: auto;
  display: flex;
  justify-content: center;
  text-align: center;
  align-content: center;
  align-items: center;
}
</style>
