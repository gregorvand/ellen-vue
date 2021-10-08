<template>
  <div>
    <button @click="saveCompanies">{{ button_label }}</button>
  </div>
</template>

<script>
import CompanyService from '@/services/CompanyService.js'

const defaultLabel = 'Save Companies'
export default {
  data() {
    return {
      button_label: defaultLabel,
    }
  },
  methods: {
    saveCompanies() {
      CompanyService.saveManyCompanies(this)
    },
  },
}
</script>

<style lang="scss" scoped>
button {
  width: 300px;
}
</style>
