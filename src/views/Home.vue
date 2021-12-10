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
    <section>
      <h3>Trending Companies</h3>
      <TrendingCompanies />
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
      <h3>Interactive charts: Average orders per month</h3>
      <img src="@/assets/ellen_chart_example.png" />

      <div class="insights-list-wrapper">
        <div class="pattern-background" :style="patternProps"></div>
        <h3>Additional metrics (coming soon)</h3>
        <ul class="insights-list list-no-bullets">
          <li>
            <img src="@/assets/checked.svg" class="" alt="insights list 1" />
            <span>AOV</span>
          </li>
          <li>
            <img
              src="@/assets/checked.svg"
              class="logo"
              alt="insights list 2"
            />
            <span>Trending SKUs</span>
          </li>
          <li>
            <img
              src="@/assets/checked.svg"
              class="logo"
              alt="insights list 3"
            />
            <span>Loyalty: frequency, recency, monetary</span>
          </li>
          <li>
            <img
              src="@/assets/checked.svg"
              class="logo"
              alt="insights list 4"
            />
            <span>Companies with similar customers</span>
          </li>
        </ul>
      </div>
    </section>
    <section class="final-register">
      <RegisterUser v-if="!loggedIn" v-bind:captureName="false" />
    </section>
  </div>
</template>

<script>
import { authComputed } from '@/store/helpers.js'
import RegisterUser from '@/views/RegisterUser.vue'
import { mapState } from 'vuex'

import SelectedCompanies from '@/components/SelectedCompanies.vue'
import TrendingCompanies from '@/components/TrendingCompanies.vue'
import SearchForm from '@/components/SearchForm.vue'

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
    SelectedCompanies,
    SearchForm,
    RegisterUser,
    TrendingCompanies,
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

  .register-form-wrapper {
    width: 100%;
    max-width: unset;
  }
}
</style>
