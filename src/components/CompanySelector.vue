<template>
  <div
    class="company-selector"
    :class="[isCategoryCompanyClass, { proprietary: !isPublicCompany }]"
  >
    <router-link
      v-if="disableCheckBox"
      class="company-selector-link"
      :to="{
        name: 'company',
        params: { id: company.id },
      }"
    >
    </router-link>
    <div class="company-details">
      <div class="company-selector-label">
        <span v-if="!disableCheckBox" class="company-selector-title">
          <router-link
            class="company-text-link"
            :to="{
              name: 'company',
              params: { id: company.id },
            }"
          >
            {{ companyName }}
          </router-link></span
        >
        <span v-else class="company-selector-title"> {{ companyName }}</span>

        <span class="ticker-label" v-if="company.ticker"
          >({{ company.ticker }})</span
        >
      </div>
      <div class="company-type">
        <span>Proprietary Insights </span>
      </div>
    </div>
    <div class="company-checkbox">
      <input
        v-if="!disableCheckBox && allowEdit"
        class="select-company"
        type="checkbox"
        v-model="checked"
        @click="selectCompany"
      />
    </div>
  </div>
</template>

<script>
import CompanyService from '@/services/CompanyService.js'
export default {
  props: {
    company: {
      type: Object,
      default: () => ({}),
    },
    selected: {
      type: Boolean,
      default: false,
    },
    disableCheckBox: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    selectCompany() {
      if (!this.checked) {
        this.$store.dispatch(
          'selectedCompanies/addCompanyToSelection',
          this.company
        )
        if (this.$route.name !== 'home') {
          CompanyService.saveCompany(this)
        }

        // this.$store.dispatch('compareCompany/updateCompare', this.company)
      } else {
        this.$store.dispatch(
          'selectedCompanies/removeCompanySelection',
          this.company
        )
        CompanyService.removeCompany(this)
        // this.$store.dispatch('compareCompany/clearCompare', this.company)
      }
    },
  },

  data() {
    return {
      // if user has already selected or follows this company, will return true, else false
      checked:
        this.$store.getters['followedCompanies/userFollowsCompany'](
          this.company.id
        ) ||
        this.$store.getters['selectedCompanies/userHasCompany'](
          this.company.id
        ),
      isPublicCompany: this.company.ticker ? true : false,
      isCategoryCompanyClass: this.company.addedFromCategory
        ? 'category-add'
        : 'individual-add',
      allowEdit: this.company.addedFromCategory ? false : true,
    }
  },

  computed: {
    companyName() {
      return this.company.companyName
        ? this.company.companyName // elastic search
        : this.company.nameIdentifier // ellen DB
    },

    companyType() {
      return this.company.companyType == 'public' ? 'p' : 'a'
    },
  },
}
</script>

<style lang="scss" scoped>
.select-company {
  width: 30px;
  height: 20px;
}

span {
  display: flex;

  &.ticker-label {
    margin-bottom: -5px;
    font-size: 10px;
    flex-grow: 1;
    justify-content: center;
    justify-content: flex-start;
    padding: 0 5px;
  }

  &.price {
    width: 30px;
    font-size: $small-label-font-size;
  }
}

.company-selector {
  // view specifics
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 350px;
  border-radius: $border-radius;
  background-color: $color-ellen-light-gray;
  display: flex;
  flex-direction: row;
  padding: 5px;
  position: relative;

  a.company-selector-link {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &:hover {
      background-color: $color-ellen-white-transparent;
      transition: all 200ms;
    }

    &:hover + .company-details > .company-selector-title {
      text-decoration: underline;
    }
  }

  &.proprietary {
    background-color: $color-ellen-brand-bright;
  }

  .company-details {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  &-label {
    display: flex;
  }

  .dashboard & {
    height: 50px;
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    .company-details-label {
      width: 100%;
      display: flex;
      height: 50%;
      align-items: center;
    }
  }

  // subcomponents
  &-title,
  .company-text-link {
    @extend %company-title;
    text-decoration: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    line-height: 1;
    height: 50%;
  }

  .company-text-link {
    text-decoration: underline;
  }

  &.category-add {
    opacity: 0.6;
    position: relative;

    &:hover {
      &:after {
        font-size: $small-label-font-size;
        content: 'Companies added by category cannot be individually changed';
        position: absolute;
        top: 2px;
        left: 0;
        background-color: white;
        height: 100%;
        color: black;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

.company-type {
  display: flex;
  width: 100%;
  font-size: $small-label-font-size;
}
</style>
