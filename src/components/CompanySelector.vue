<template>
  <div class="company-selector" :class="isCategoryCompanyClass">
    <div class="company-selector-label">
      <router-link
        v-if="this.$route.name == 'dashboard'"
        :to="{
          name: 'company',
          params: { id: company.id },
        }"
      >
        <span>{{ companyName }}</span>
      </router-link>
      <span v-else>{{ companyName }}</span>
      <span v-if="company.ticker">({{ company.ticker }})</span>
    </div>

    <span :class="'company-type-label ' + isPublicCompany">
      {{ isPublicCompany }}
    </span>
    <div class="checkbox-spacer">
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
        this.$store.dispatch('compareCompany/updateCompare', this.company)
      } else {
        this.$store.dispatch(
          'selectedCompanies/removeCompanySelection',
          this.company
        )
        this.$store.dispatch('compareCompany/clearCompare', this.company)
      }
    },
  },

  data() {
    return {
      // if user has already selected this company, will return true, else false
      checked: this.$store.getters['selectedCompanies/userHasCompany'](
        this.company.id
      ),
      isPublicCompany: this.company.ticker ? 'public' : 'private',
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
  },
}
</script>

<style lang="scss" scoped>
.select-company,
.checkbox-spacer {
  height: 1.6em;
  width: 30px;
}

span {
  display: flex;
  width: 100%;
}

.company-selector {
  // view specifics

  .dashboard & {
    width: 500px;
    height: 40px;
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    &-label {
      width: 100%;
    }
  }

  // subcomponents
  &-label {
    width: 65%;
    font-size: 13px;
  }

  &.category-add {
    opacity: 0.4;
    position: relative;

    &:hover {
      &:after {
        content: 'Companies added by category cannot be individually changed';
        position: absolute;
        top: 0;
        left: 0;
        background-color: white;
        width: 500px;
        height: 100%;
        color: black;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
}

.company-type-label {
  background-color: #efefef;
  // position: absolute;
  right: 100px;
  width: 50px;
  border-radius: 5px;
  color: white;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  text-transform: uppercase;
  padding: 5px;

  &.public {
    background-color: blue;
  }

  &.private {
    background-color: rgb(216, 17, 235);
  }
}
</style>
