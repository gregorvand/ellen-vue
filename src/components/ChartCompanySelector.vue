<template>
  <button
    class="company-selector"
    :class="{ active: currentCompanyID == company.id }"
    @click="toggleCompareCompany"
  >
    <div class="company-selector-label">
      <span>{{ companyName }}</span>
    </div>
  </button>
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
    current: {
      type: Object,
    },
  },

  methods: {
    toggleCompareCompany() {
      this.currentCompare = this.company.id
      this.$store.dispatch('compareCompany/updateCompare', this.company)
    },
  },

  computed: {
    companyName() {
      return this.company.companyName
        ? this.company.companyName // elastic search
        : this.company.nameIdentifier // ellen DB
    },

    currentCompanyID() {
      return this.current?.id || 0
    },
  },
}
</script>

<style lang="scss" scoped>
.company-selector {
  cursor: pointer;
  width: 200px;
  display: flex;
  position: relative;

  &.active {
    text-decoration: underline;
    background: $color-ellen-brand-dark;
    color: $color-white;
  }
}
</style>
