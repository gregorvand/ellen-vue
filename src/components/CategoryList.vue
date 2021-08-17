<template>
  <div>
    <p>
      ELLEN recommends adding one or more categories to stay up to date with a
      specific sector of interest
    </p>
    <div class="category-list">
      <div
        :class="'category-list-item'"
        v-for="category in currentList"
        :key="category.id"
        :category="category"
      >
        <CategorySelector :category="category" />
      </div>
    </div>
  </div>
</template>

<script>
import CategorySelector from '@/components/CategorySelector.vue'

import { mapState } from 'vuex'
export default {
  components: {
    CategorySelector,
  },
  data() {
    return {
      intro: 'hello',
    }
  },
  created() {
    this.$store.dispatch('categories/fetchCategories', this.company)
  },
  computed: {
    ...mapState('categories', ['currentList']),
  },
}
</script>

<style lang="scss" scoped>
p {
  font-size: $small-label-font-size;
}
.category-list {
  width: 100%;
  max-width: 100vw;
  padding: 0 20px 20px;
  margin: 20px auto;
  text-align: left;
  display: flex;
  overflow-x: scroll;

  &-item {
    background-color: #efefef;
    padding: 5px;
    margin: 5px;
    width: 45%;
    font-weight: 600;
    background-color: $color-ellen-brand;
    text-transform: capitalize;
  }
}
</style>
