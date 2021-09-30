<template>
  <div class="search-component" v-click-outside="clearInput">
    <form class="search-companies-form" @submit.prevent>
      <input
        v-on:keyup="searchCompanies"
        type="text"
        v-model="currentQuery"
        @keyup.esc="clearInput"
        placeholder="Search for a company"
      />

      <ul class="companies-results" v-if="results.length > 0">
        <li v-for="result in results" :key="result.id">
          <CompanySelector :company="result" />
        </li>
      </ul>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CompanySelector from '@/components/CompanySelector.vue'

export default {
  components: {
    CompanySelector,
  },
  data: function () {
    return {
      currentQuery: null,
    }
  },
  methods: {
    searchCompanies() {
      this.$store.dispatch('search/doSearchQuery', this.currentQuery)
    },
    clearInput() {
      this.currentQuery = ''
      this.$store.dispatch('search/doSearchQuery', '')
    },
  },
  computed: {
    ...mapState('search', ['results']),
    ...mapState('selectedCompanies', ['selectedCompanies']),
  },
}
</script>

<style lang="scss" scoped>
.search-companies-form {
  position: relative;
}

.search-component {
  width: 100%;
  padding: 15px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;

  form {
    margin-bottom: 0 !important;
    width: 100%;
  }

  input {
    text-align: center;
    height: 50px;
    border-radius: $border-radius;
    @extend %heading-font-family;
    color: $color-ellen-dark;
    font-size: rem-calc(16px);
    border-color: $color-ellen-dark-gray;

    &:focus-visible {
      outline-color: $color-ellen-dark;
    }

    &::placeholder {
      @extend %heading-font-family;
      color: $color-ellen-dark-gray;
      font-size: rem-calc(13px);
      text-align: center;
      padding-bottom: 0px;
    }
  }
}

.companies-results {
  display: flex;
  max-height: 300px;
  overflow-y: scroll;
  border: solid #e2e2e2 thin;
  top: 35px;
  position: absolute;
  width: 100%;
  box-sizing: border-box;
  justify-content: flex-start;
  background-color: #fffdf1;
  padding: 10px;

  li div {
    justify-content: space-between;
    text-align: left;
  }
}

ul,
li {
  list-style: none;
  display: flex;
  width: 100%;
  justify-content: center;
  margin-left: 0;
  padding: 0;
}

ul {
  flex-direction: column;
}

li {
  margin-bottom: 10px;
  > div {
    display: flex;
    width: 100%;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
