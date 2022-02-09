<template>
  <div class="search-component" v-click-outside="clearInput">
    <form class="search-companies-form" @submit.prevent>
      <input
        v-on:keyup="searchCompanies"
        v-touch:tap="searchCompanies"
        type="text"
        v-model="currentQuery"
        placeholder="Search for a company"
      />
      <div v-if="showSuggest" class="pinned-absolute-right suggest-link">
        <a
          class="small-link"
          href="https://wsgp9kcvel1.typeform.com/to/FdUJCtON"
          target="_blank"
          >Can't find a company? Suggest here</a
        >
      </div>

      <div v-if="showCheckbox">
        <ul class="companies-results" v-if="results.length > 0 && activeForm">
          <li v-for="result in results" :key="result.id">
            <CompanySelector :company="result" />
          </li>
        </ul>
      </div>
      <div v-else>
        <ul class="companies-results" v-if="results.length > 0 && activeForm">
          <li v-for="result in results" :key="result.id">
            <CompanySelector :company="result" v-bind:disableCheckBox="true" />
          </li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CompanySelector from '@/components/CompanySelector.vue'

export default {
  props: {
    showCheckbox: {
      type: Boolean,
    },
  },
  components: {
    CompanySelector,
  },
  data: function () {
    return {
      currentQuery: null,
      parent: this.$parent,
      activeForm: false,
    }
  },
  methods: {
    searchCompanies() {
      this.activeForm = true
      this.$store.dispatch('search/doSearchQuery', this.currentQuery)
    },
    clearInput() {
      this.activeForm = false
      if (this.currentQuery !== '') {
        this.currentQuery = ''
        this.$store.dispatch('search/clearResults', '')
      }
    },
  },
  computed: {
    showSuggest() {
      return this.$route.name === 'home' ? true : false
    },
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
  position: relative;
  z-index: base_index(super);

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

  .company-selector {
    width: 100%;
  }

  .suggest-link {
    @include breakpoint(small only) {
      position: relative;
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
