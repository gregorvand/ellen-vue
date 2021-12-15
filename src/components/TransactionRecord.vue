<template>
  <div class="transaction-wrapper">
    <h3>Credit Transaction History</h3>
    <div class="grid-table headers">
      <span>Amount</span>
      <span>Info</span>
      <span>Company</span>
      <span>Transaction Date</span>
    </div>
    <div
      class="grid-table"
      v-for="transaction in transactionList"
      :key="transaction.id"
    >
      <span>{{ transaction.value | plusMinus }}</span>
      <span>{{ transaction.method }}</span>
      <span v-if="transaction.emailIdentifier !== 'undefined'">{{
        transaction.emailIdentifier | filterEmail
      }}</span>
      <span>{{ transaction.createdAt | formatDate }}</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
export default {
  data: function () {
    return {
      transactionList: [],
    }
  },
  created() {
    axios
      .get(`${process.env.VUE_APP_API_URL}/api/transactions/list`)
      .then(({ data }) => {
        this.transactionList = data
      })
  },
  filters: {
    plusMinus: function (value) {
      parseInt(value)
      if (value > 0) {
        return `+${value}`
      } else {
        return `${value}`
      }
    },
    filterEmail(value) {
      if (!value) {
        return '--'
      } else {
        let email = value.split('@')
        return email[1]
      }
    },
    formatDate(date) {
      let readableDate = dayjs(date).format('MMMM DD, YYYY')
      return readableDate
    },
  },
}
</script>

<style lang="scss" scoped>
.transaction-wrapper {
  margin: 20px auto;
  width: 100%;
  max-width: 900px;
  background-color: $color-ellen-light-gray;
  padding: 10px;

  h3 {
    margin-bottom: 10px;
  }
}
.grid-table {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  width: 100%;

  span {
    max-width: 250px;
    text-align: left;
    border-bottom: solid #efeffe thin;
  }

  &.headers {
    span {
      font-weight: bolder;
    }
  }
}
</style>
