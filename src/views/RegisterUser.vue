<template>
  <div class="register-form-wrapper">
    <form @submit.prevent="register">
      <!-- <label for="email"> Email </label> -->

      <div class="flex-wrapper mobile-column">
        <input
          v-model="email"
          type="email"
          name="email"
          value
          placeholder="Email"
        />
        <password
          v-model="password"
          @feedback="showFeedback"
          @score="showScore"
          defaultClass="ellen-input"
          :secureLength="8"
          :badge="false"
          :placeholder="'Choose password'"
        />

        <button
          type="submit"
          name="button"
          :class="{ active: passwordScore > 2 }"
          class="register-button"
          @click="register"
        >
          Register
        </button>
      </div>
      <div class="flex-wrapper password-suggestions">
        <span>{{ passSuggestions.suggestions[0] }}</span>
        <span>{{ passSuggestions.warnings }}</span>
        <p>{{ error }}</p>
      </div>

      <router-link
        class="margin-top small-link"
        @click.native="scrollToTop"
        to="/login"
      >
        Already have an account? Login.
      </router-link>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Password from 'vue-password-strength-meter'
export default {
  components: { Password },
  data() {
    return {
      fname: '',
      lname: '',
      email: '',
      password: null,
      error: null,
      suggestions: '',
      warnings: '',
      passwordScore: 0,
    }
  },
  methods: {
    register() {
      if (this.passwordScore > 2) {
        this.$store
          .dispatch('user/register', {
            firstName: this.fname,
            lastName: this.lname,
            email: this.email,
            password: this.password,
            userCompanies:
              this.$store.getters['selectedCompanies/userCompanies'],
          })
          .then(() => {
            this.$router.push({ name: 'onboarding' })
          })
          .catch((err) => {
            let errorMessages = err.response.data.message.errors.map(
              (error) => {
                return error.message
              }
            )
            this.error = errorMessages
          })
      } else {
        this.error = 'Password is not strong enough'
      }
    },
    showFeedback({ suggestions, warning }) {
      this.suggestions = suggestions
      this.warnings = warning
    },
    showScore(score) {
      this.passwordScore = score
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    },
  },
  computed: {
    passSuggestions() {
      return { suggestions: this.suggestions, warnings: this.warnings }
    },
    ...mapState('selectedCompanies', ['selectedCompanies']),
    ...mapState('selectedCategories', ['selectedCategories']),
    allSelectedCompanies() {
      const categoryCompanies = this.selectedCategories.map(
        (category) => category.Companies
      )
      return [this.selectedCompanies, ...categoryCompanies]
    },
  },
}
</script>

<style lang="scss" scoped>
* {
  text-align: center;
  margin: 0 auto;
}

.register-form-wrapper {
  max-width: 700px;
  background-color: $color-ellen-brand-bright;
  padding: 30px;

  .flex-wrapper {
    width: 100%;
  }

  .Password {
    width: 100%;
    height: 70px;
    @include breakpoint(medium up) {
      width: auto;
      height: 50px;
    }

    .ellen-input {
      width: 100%;
    }
  }

  .password-suggestions {
    flex-direction: column;
    font-size: 11px;
    margin-top: 20px;
  }

  form {
    display: flex;
    flex-direction: column;
    width: 100%;

    button,
    input,
    .ellen-input {
      margin: 10px auto;
      height: 50px;
      width: 100%;

      @include breakpoint(medium up) {
        margin: 0 5px;
      }
    }

    button {
      width: 30%;
    }

    .register-button {
      opacity: 0.5;
      pointer-events: none;

      &.active {
        opacity: 1;
        pointer-events: all;
      }
    }

    .Password__field {
      color: red;
    }
  }
}
label {
  @extend %body-font-family;
  width: 100%;
  font-size: $small-label-font-size;
  text-align: left;
}

input {
  border-radius: $border-radius;
  @extend %body-font-family;
  line-height: normal;
  height: 42px;
  display: flex;
  width: 100%;

  &::placeholder {
    @extend %heading-font-family;
    color: $color-ellen-dark-gray;
    font-size: rem-calc(12px);
    text-align: center;
    margin: 0;
    padding: 0;
  }
}

.register-payment-blurb {
  @extend %body-font-family;
  font-size: $small-label-font-size;
  margin: 10px auto;
}

.final-register {
  form {
    max-width: $inner-max-width + 70px;
  }
}
</style>
