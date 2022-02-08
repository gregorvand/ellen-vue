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
    <a @click="openTerms" class="small-link" target="_blank">
      View our platform & data Terms of Use
      <br />(required to proceed)
    </a>

    <div class="checkbox-container">
      <label for="shopify">
        I am a Shopify merchant with an active account</label
      >
      <input type="checkbox" id="shopify" v-model="shopifyChecked" />
    </div>
    <div class="checkbox-container">
      <label for="terms">
        I accept the Terms of Use for how ELLEN data can be used
      </label>
      <input type="checkbox" id="terms" v-model="termsChecked" />
    </div>

    <h3
      class="continue-button"
      :class="{ active: allTermsPassed }"
      @click="continueToDashboard"
    >
      <span v-if="allTermsPassed">Continue to your dashboard ></span>
      <span v-else
        >Almost there - read and accept the above terms to proceed</span
      >
    </h3>
  </div>
</template>

<script>
export default {
  data() {
    return {
      shopifyChecked: false,
      termsChecked: false,
      termsRead: false,
    }
  },
  methods: {
    continueToDashboard() {
      if (this.shopifyChecked && this.termsChecked) {
        this.$router.push({ name: 'dashboard' })
      }
    },
    readTerms() {
      this.termsRead = true
    },
    openTerms() {
      this.termsRead = true
      window.open('/terms', '_blank')
    },
  },
  computed: {
    allTermsPassed() {
      return this.shopifyChecked && this.termsChecked && this.termsRead
    },
  },
}
</script>

<style lang="scss" scoped>
.video-wrapper {
  width: 100%;
}

a {
  color: $color-ellen-dark;
  text-decoration: underline;
  cursor: pointer;
  padding: 10px;
}

.loom-style {
  height: 360px;
  width: 630px;
  position: relative;
  margin-bottom: 20px;

  @include breakpoint(small only) {
    height: 230px;
    width: 90%;
  }
}

.checkbox-container {
  display: flex;
  background-color: $color-ellen-brand;
  line-height: 1;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  margin: 5px auto;
  cursor: pointer;

  &:hover {
    > label {
      color: $color-ellen-dark;
    }
  }
}

label {
  margin-top: 5px;
  height: 100%;
  margin-right: 10px;
  cursor: pointer;

  &::selection {
    background: transparent;
  }
}

.continue-button {
  opacity: 0.5;
  pointer-events: none;
  margin-bottom: 20px;

  &.active {
    opacity: 1;
    cursor: pointer;
    pointer-events: auto;
    text-decoration: underline;

    &:hover {
      color: $color-ellen-dark;
    }
  }
}
</style>
