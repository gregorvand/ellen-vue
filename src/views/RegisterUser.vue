<template>
  <div class="register-form-wrapper">
    <form @submit.prevent="register">
      <label for="fname"> First Name </label>
      <input
        v-model="fname"
        type="text"
        name="fname"
        value
        placeholder="First Name"
      />

      <label for="lname"> Last Name </label>
      <input
        v-model="lname"
        type="text"
        name="lname"
        value
        placeholder="Last Name"
      />

      <label for="email"> Email </label>
      <input
        v-model="email"
        type="email"
        name="email"
        value
        placeholder="Email"
      />

      <label for="password"> Password </label>
      <input
        v-model="password"
        type="password"
        name
        value
        placeholder="Choose password (minimum 8 characters)"
      />

      <span class="register-payment-blurb"
        >payment details will be added at the next step</span
      >

      <button type="submit" name="button">Register</button>

      <p>{{ error }}</p>

      <router-link to="/login"> Already have an account? Login. </router-link>
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
          this.error = err.response.data.message
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
