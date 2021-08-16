<template>
  <div class="selected-companies-wrapper">
    <h4>Your selected companies</h4>
    <ul class="selected-companies-key">
      <li>
        <span class="key">P</span> ELLEN’s inrivalled sales insights, updated
        weekly
      </li>
      <li>
        <span class="key">B</span> Automated alerts and updates for public
        company information
      </li>
    </ul>
    <div class="selected-companies">
      <ul
        v-if="selectedCompanies.length > 0"
        class="selected-companies-listing"
      >
        <li v-for="company in selectedCompanies" :key="company.id">
          <CompanySelector :company="company" />
        </li>
      </ul>
      <p v-else>Search and select companies above</p>
    </div>
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
  background-color: $color-ellen-light-gray;
  border: solid $color-ellen-light-gray thin;
  height: 200px;
  flex-direction: column;

  @include breakpoint(large up) {
    flex-direction: row;
  }
}

h4 {
  text-align: center;
  justify-content: center;
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

ul.selected-companies-listing > li {
  border-bottom: solid $color-ellen-dark-gray thin;
  padding-bottom: 5px;
}

ul.selected-companies-key {
  @extend %body-font-family;
  width: 100%;

  li {
    font-size: rem-calc(11px);
    text-align: left;
    width: 100%;
    justify-content: flex-start;
    margin: 0;
    margin-bottom: 5px;
    padding: 0 15px;

    .key {
      width: 16px;
      height: 16px;
      background-color: red;
      align-items: center;
      justify-content: center;
      display: flex;
      line-height: 12px;
      color: white;
      font-weight: 600;
      margin-right: 5px;
    }
  }
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
