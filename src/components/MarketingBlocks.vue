<template>
  <div>
    <section class="list-image insights-summary">
      <h3>Our Proprietary Insights</h3>
      <div class="flex-wrapper">
        <div class="left">
          <ul>
            <li>
              <h4>Monthly Order Volume</h4>
              How fast is a company growing? What are their best months?
            </li>
            <li>
              <h4>Top selling SKUs</h4>
              Identify product trends and the moneymaking heros
            </li>
            <li>
              <h4>Average Order Value</h4>
              The best eCom brands grow their AOV each quarter
            </li>
            <li>
              <h4>Customer Loyalty</h4>
              How many orders per year does a customer place?
            </li>
            <li>
              <h4>Marketshare (Coming Soon)</h4>
              A basket of competitors and their relative marketshare
            </li>
          </ul>
        </div>
        <div class="right">
          <img src="~@/assets/insights_chart_ex.png" alt="" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.insights-summary {
  padding: 40px 15px;

  @include breakpoint(large up) {
    padding: 40px 5px;
  }

  h3 {
    text-align: left;
    font-size: 30px;
    color: $color-ellen-dark;
  }

  ul {
    max-width: 75%;
    li {
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
}
.flex-wrapper {
  max-width: 1024px;
  width: 100%;
  @include breakpoint(small only) {
    flex-direction: column;
  }
  .left,
  .right {
    width: 100%;
    img {
      width: 100%;
    }

    @include breakpoint(medium up) {
      width: 50%;
    }
  }

  .left {
    text-align: left;
  }
}
</style>
