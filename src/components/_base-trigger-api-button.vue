<template>
  <div>
    <button @click="triggerAPI">{{ label }}</button>
  </div>
</template>

<script>
import axios from 'axios'
import store from '@/store/store'

export default {
  props: {
    label: {
      type: String,
      default: 'Get earnings',
    },
    apiPath: {
      type: String,
    },
  },

  methods: {
    triggerAPI() {
      axios({
        method: 'get',
        url: `${process.env.VUE_APP_API_URL}/api${this.apiPath}`,
      }).then(({ data }) => {
        if (Array.isArray(data)) {
          store.dispatch('earnings/addReportToEarnings', data)
        } else {
          const notification = {
            type: 'success',
            message: data,
          }
          store.dispatch('notification/add', notification, { root: true })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
button {
  width: 200px;
  margin: 10px auto;
}
</style>
