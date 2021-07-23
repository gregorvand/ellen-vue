<template>
  <div class="category-selector">
    <div class="category-selector-label">
      <span>{{ category.name }}</span>
    </div>
    <input
      v-if="!disableCheckBox"
      class="select-category"
      type="checkbox"
      v-model="checked"
      @click="selectCategory"
    />
  </div>
</template>

<script>
export default {
  props: {
    category: {
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
    selectCategory() {
      if (!this.checked) {
        this.$store.dispatch(
          'selectedCategories/addCategoryToSelection',
          this.category
        )

        const allCategoryCompanies = this.category.Companies
        allCategoryCompanies.forEach((company) => {
          this.$store.dispatch(
            'selectedCompanies/addCompanyToSelection',
            company
          )
        })
      } else {
        this.$store.dispatch(
          'selectedCategories/removeCategorySelection',
          this.category
        )

        const allCategoryCompanies = this.category.Companies
        allCategoryCompanies.forEach((company) => {
          this.$store.dispatch(
            'selectedCompanies/removeCompanySelection',
            company
          )
        })
      }
    },
  },

  data() {
    return {
      // if user has already selected this category, will return true, else false
      checked: this.$store.getters['selectedCategories/userHasCategory'](
        this.category.id
      ),
    }
  },

  // computed: {
  //   categoryName() {
  //     return this.category.categoryName
  //       ? this.category.categoryName // elastic search
  //       : this.category.nameIdentifier // ellen DB
  //   },
  // },
}
</script>

<style lang="scss" scoped>
.select-category {
  height: 1.6em;
  width: 30px;
}

span {
  display: flex;
  width: 100%;
}

.category-selector {
  // view specifics
  .dashboard & {
    width: 100%;
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
}

.category-type-label {
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
