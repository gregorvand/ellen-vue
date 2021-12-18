<template>
  <div class="container">
    <h3>Credit Transaction History</h3>
    <h4>(Latest 20)</h4>
    <div class="transaction-wrapper">
      <div class="grid-table headers">
        <span>Date</span>
        <span class="not-tablet not-mobile">Info</span>
        <span>Company</span>
        <span>Amount</span>
      </div>
      <div class="overflow-y">
        <div
          class="grid-table"
          v-for="transaction in transactionList"
          :key="transaction.id"
        >
          <span>{{ transaction.createdAt | formatDate }}</span>
          <span class="not-tablet not-mobile">{{ transaction.method }}</span>
          <span v-if="transaction.emailIdentifier !== 'undefined'">{{
            transaction.emailIdentifier | filterEmail
          }}</span>

          <span :class="{ bolder: transaction.value > 0 }">{{
            transaction.value | plusMinus
          }}</span>
        </div>
      </div>
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
      value = parseInt(value)
      if (value > 0) {
        return `+ ${value}`
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
      let readableDate = dayjs(date).format('DD-MMM-YY')
      return readableDate
    },
  },
}
</script>

<style lang="scss" scoped>
h3 {
  margin: 10px auto 0;
}
h4 {
  margin: 0 auto;
}
.transaction-wrapper {
  margin: 20px auto;
  width: 100%;
  max-width: 800px;
  background-color: $color-ellen-light-gray;
  padding: 10px;
  border-radius: $border-radius;
}

.overflow-y {
  max-height: 200px;
  padding: 5px;
}

.grid-table {
  display: grid;
  grid-template-columns: 0.5fr 1.5fr 1fr;
  width: 100%;
  padding-right: 10px;

  @include breakpoint(medium up) {
    grid-template-columns: 0.5fr 2fr 1fr;
  }

  @include breakpoint(large up) {
    grid-template-columns: 0.5fr 1fr 2fr 1fr;
  }

  span {
    text-align: right;
    border-bottom: solid #efeffe thin;
    font-size: rem-calc(14px);
  }

  &.headers {
    span {
      font-weight: bolder;
    }
  }
}
</style>
