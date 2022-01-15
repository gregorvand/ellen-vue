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
  height: auto;
  padding: 20px;
  width: 100%;
  background-color: $color-ellen-brand-dark;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  @include breakpoint(medium up) {
    flex-direction: row;
    height: 35vh;
    max-height: 445px;
  }

  &,
  * {
    color: $color-white;
  }
}

.left,
.right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  text-align: left;
  /* align-items: center; */
  height: auto;

  max-width: 600px;

  img {
    display: none;
  }

  @include breakpoint(medium up) {
    width: 50%;
    padding: 0px 5%;

    img {
      display: flex;
      max-width: 75%;
    }
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
