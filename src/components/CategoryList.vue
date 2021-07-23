<template>
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
.category-list {
  border: solid red thin;
  width: 100%;
  max-width: 500px;
  padding: 20px;
  margin: 20px auto;
  text-align: left;

  &-item {
    background-color: #efefef;
    padding: 5px;
    margin: 5px;
  }
}
</style>
