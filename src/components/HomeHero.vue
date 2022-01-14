<template>
  <div class="hero mid-hero">
    <div class="left">
      <h2>eCommerce</h2>
      <h1>Benchmarking & Insights</h1>
      <p>
        We record and analyze millions of purchases from de-identified U.S.
        consumers every day.
      </p>
      <h3>Stay competitive with affordable insights.</h3>
    </div>
    <div class="right">
      <img src="@/assets/hero_chart.svg" class="logo" alt="insights list 3" />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.hero {
  height: 445px;
  width: 100%;
  background-color: #c0e0de;
  display: flex;
  align-items: center;
  justify-content: center;
}

.left,
.right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
  text-align: left;
  /* align-items: center; */
  height: 100%;
  padding: 0px 5%;
  max-width: 600px;

  img {
    max-width: 500px;
  }
}

.left-right {
  align-items: flex-end;
}

.right {
  text-align: right;
  align-items: flex-start;
}
</style>
