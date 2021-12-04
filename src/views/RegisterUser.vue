<template>
  <div class="register-form-wrapper">
    <form @submit.prevent="register">
      <!-- <label for="email"> Email </label> -->

      <div class="flex-wrapper">
        <input
          v-model="email"
          type="email"
          name="email"
          value
          placeholder="Email"
        />

        <!-- <label for="password"> Password </label> -->
        <input
          v-model="password"
          type="password"
          name="password"
          value
          placeholder="Choose password (minimum 8 characters)"
        />

        <button type="submit" name="button">Register</button>
      </div>
      <div class="flex-wrapper">
        <p>{{ error }}</p>
      </div>

      <router-link class="margin-top" to="/login">
        Already have an account? Login.
      </router-link>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      fname: '',
      lname: '',
      email: '',
      password: '',
      error: null,
    }
  },
  methods: {
    register() {
      this.$store
        .dispatch('user/register', {
          firstName: this.fname,
          lastName: this.lname,
          email: this.email,
          password: this.password,
          userCompanies: this.$store.getters['selectedCompanies/userCompanies'],
        })
        .then(() => {
          this.$router.push({ name: 'dashboard' })
        })
        .catch((err) => {
          let errorMessages = err.response.data.message.errors.map((error) => {
            return error.message
          })
          this.error = errorMessages
          console.log(err.response.data)
        })
    },
  },
  computed: {
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

  .flex-wrapper {
    width: 100%;
  }

  form {
    display: flex;
    flex-direction: column;
    width: 100%;

    button,
    input {
      margin: 0 5px;
      height: 50px;
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
  line-height: 1;
  height: 42px;
  display: flex;
  width: 100%;

  &::placeholder {
    @extend %heading-font-family;
    color: $color-ellen-dark-gray;
    font-size: rem-calc(12px);
    text-align: center;
    padding-bottom: 6px;
  }
}

.register-payment-blurb {
  @extend %body-font-family;
  font-size: $small-label-font-size;
  margin: 10px auto;
}
</style>
