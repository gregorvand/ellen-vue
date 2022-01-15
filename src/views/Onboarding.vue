<template>
  <div class="video-wrapper">
    <h1>Welcome to</h1>
    <img
      src="@/assets/ELLENv2logo.svg"
      class="logo"
      alt="welcome to ELLEN insights"
    />
    <p>Here is a quick intro to the platform from one of our founders</p>
    <div class="loom-style">
      <iframe
        src="https://www.loom.com/embed/aaad8ac0e94d48a393cfaa753f36721e"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
      ></iframe>
    </div>
    <router-link :to="{ name: 'dashboard' }"
      ><h3>Continue to your dashboard ></h3>
    </router-link>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.video-wrapper {
  width: 100%;
}

a {
  color: $color-ellen-dark;
}

.loom-style {
  height: 500px;
  width: 75%;
  max-width: 1040px;
  position: relative;
  margin-bottom: 20px;
}
</style>
