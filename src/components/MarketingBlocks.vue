<template>
  <div>
    <section class="list-image insights-summary">
      <h3>Our Proprietary Insights</h3>
      <div class="flex-wrapper">
        <div class="left">
          <ul>
            <li>
              <h4>Monthly Order Volume</h4>
              How fast is a company growing? <br />
              What are their best months?
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
              <h4>Market share (Coming Soon)</h4>
              A basket of competitors <br />
              and their relative market share
            </li>
          </ul>
        </div>
        <div class="right">
          <img src="~@/assets/insights_chart_ex.png" alt="" />
        </div>
      </div>
    </section>
    <section class="data-summary">
      <h3>OUR DATA</h3>
      <h4>What makes ELLEN Insights and our data unique?</h4>
      <div class="flex-wrapper">
        <ul>
          <li>
            <h3>Competitive</h3>
            Analyze company performance, conduct competitive benchmarking, and
            discover industry trends.
          </li>
          <li>
            <h3>Affordable</h3>
            Enterprise level data analytics at a SMB price. No lengthy annual
            contracts.
          </li>
          <li>
            <h3>Actionable</h3>
            A self-service dashboard to help you identify KPI performance gaps
            (growth, loyalty, AOV) versus your competitors.
          </li>
          <li>
            <h3>Presentable</h3>
            Highly accurate, up-to-date data that can be easily visualized and
            shared.
          </li>
        </ul>
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
  display: flex;
  flex-direction: column;
  align-items: center;

  @include breakpoint(large up) {
    padding: 60px 5px;
  }

  h3 {
    text-align: left;
    font-size: 30px;
    color: $color-ellen-dark;
  }

  ul {
    @include breakpoint(medium up) {
      max-width: 75%;
    }
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
  }

  .left {
    text-align: left;

    @include breakpoint(medium up) {
      width: 40%;
    }
  }

  .right {
    @include breakpoint(medium up) {
      width: 60%;
    }
  }
}

.data-summary {
  background-color: rgba(192, 224, 222, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;

  .flex-wrapper {
    width: auto;
  }

  ul {
    padding: 20px 0;
    display: grid;
    grid-template: 1fr / 1fr 1fr;

    li {
      max-width: 300px;
      padding: 20px;
      text-align: left;
      font-size: rem-calc(14);

      h3 {
        @extend %company-title;
        font-size: rem-calc(24);
      }
    }
  }
}
</style>
