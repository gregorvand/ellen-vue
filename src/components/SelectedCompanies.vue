<template>
  <div class="selected-companies">
    <h4>Your selected companies</h4>
    <ul>
      <li v-for="company in selectedCompanies" :key="company.id">
        <CompanySelector :company="company" />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CompanySelector from '@/components/CompanySelector.vue'
export default {
  components: {
    CompanySelector,
  },
  computed: {
    ...mapState('selectedCompanies', ['selectedCompanies']),
  },
}
</script>

<style lang="scss" scoped>
.selected-companies {
  display: flex;
  width: 100%;
  border: solid gray thin;
  height: 200px;
  flex-direction: column;

  @include breakpoint(large up) {
    flex-direction: row;
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
  overflow-y: scroll;
  justify-content: flex-start;
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
