<template>
  <div class="selected-companies-wrapper">
    <h4>Your selected companies</h4>
    <ul class="selected-companies-key">
      <li>
        <span class="key key-private">A</span> ELLEN’s inrivalled sales
        insights, updated weekly
      </li>
      <li>
        <span class="key key-public">P</span> Automated alerts and updates for
        public company information
      </li>
    </ul>
    <div class="selected-companies">
      <ul
        v-if="selectedCompanies.length > 0"
        class="selected-companies-listing"
        ref="scrollingEl"
      >
        <li v-for="company in selectedCompanies" :key="company.id">
          <CompanySelector :company="company" />
        </li>
      </ul>
      <p class="selected-companies-blank-prompt" v-else>
        Search and select companies above
      </p>
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
  updated: function () {
    try {
      this.$refs.scrollingEl.scrollTop = this.$refs.scrollingEl.scrollHeight
    } catch (e) {}
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

  &-blank-prompt {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.5;
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

ul.selected-companies-listing {
  margin: 0;
  > li {
    border-bottom: solid $color-ellen-dark-gray thin;

    margin: 0;

    > div {
      height: 62px;
    }
  }
}

ul.selected-companies-key {
  @extend %body-font-family;
  width: 100%;

  li {
    font-size: $small-label-font-size;
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

      &-public {
        background-color: $color-ellen-brand-dark;
      }
      &-private {
        background-color: $color-ellen-brand-bright;
        color: $color-black;
      }
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
