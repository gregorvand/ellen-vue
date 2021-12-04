<template>
  <div class="selected-companies-wrapper">
    <div class="pattern-background" :style="patternProps"></div>
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
  data: function () {
    return {
      patternProps: {
        backgroundImage: `url(${require('@/assets/ellen_pattern.svg')})`,
      },
    }
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
  border: solid $color-ellen-light-gray thin;
  height: 240px;
  flex-direction: column;
  position: relative;
  max-width: 700px;
  padding: 30px;
  border-radius: $border-radius;
  margin: 0 auto;
  position: relative;
  background-color: $color-white;

  &-wrapper {
    width: 100%;
    position: relative;
  }

  @include breakpoint(large up) {
    flex-direction: row;
  }

  &-blank-prompt {
    height: 85%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.5;
  }
}

h4 {
  @extend %subheading;
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
    border: solid $color-ellen-light-gray thin;
    border-radius: $border-radius;
    margin: 5px 0;

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

    @include breakpoint(small only) {
      padding: 0 $mobile-padding;
    }

    .key {
      @extend %company-type-label;
      margin-right: 10px;

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

  .company-selector {
    width: 100%;
  }
}
</style>
