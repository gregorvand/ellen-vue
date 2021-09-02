<template>
  <div>
    <h1>its Earnings time..</h1>
    <BaseTriggerApiButton apiPath="/awaitedearningscalendar" />
    <BaseTriggerApiButton
      apiPath="/earningemail/send"
      label="Email people (manual)"
    />

    <!-- currently does not handle data structure if webhook received after get earnings -->
    <template v-if="liveEarnings !== []">
      <ul
        class="awaited-earnings"
        v-for="earning in reversedEarnings"
        :key="earning.symbol"
      >
        <li>{{ earning.ticker }}</li>
        <li>expected around: {{ earning.date | readableDate }}</li>
        <li>for Q{{ earning.quarter }}</li>
      </ul>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '@/store/store'
import io from 'socket.io-client'
const socket = io.connect(`${process.env.VUE_APP_API_URL}`)

// good socket debug
// console.log(socket)

socket.on('earningsData', (fetchedData) => {
  store.dispatch('earnings/addReportToEarnings', fetchedData)
})

export default {
  computed: {
    ...mapState('earnings', ['liveEarnings']),
    reversedEarnings() {
      return this.liveEarnings
    },
  },

  filters: {
    readableDate: function (date) {
      return new Date(date).toDateString()
    },
  },
}
</script>

<style lang="scss" scoped>
.awaited-earnings {
  display: flex;

  > li {
    display: flex;
    margin: 0 5px;
  }
}
</style>
