<template>
  <div>
    <div class="title-banner-group">
      <h1>Forgot password</h1>
      <p>Enter the email below that you used to sign up for Ellen.</p>
    </div>
    <form @submit.prevent="forgotPassword">
      <input
        v-model="email"
        type="email"
        name="email"
        value
        placeholder="Your Ellen user email"
      />

      <button type="submit" name="button">Request Password Reset</button>

      <p>{{ message }}</p>
      <p>{{ error }}</p>

      <router-link to="/register" class="small-link">
        Don't have an account? Register.
      </router-link>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      email: '',
      error: null,
      message: null,
    }
  },
  methods: {
    forgotPassword() {
      axios({
        method: 'put',
        url: `${process.env.VUE_APP_API_URL}/api/forgot-password`,
        data: {
          userEmail: this.email,
        },
      })
        .then((res) => {
          this.message = res.data.message
        })
        .catch((err) => {
          this.error = err?.response?.data || err
        })
    },
  },
}
</script>

<style lang="scss" scoped>
form {
  width: 300px;
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  input {
    width: 100%;
    height: 40px;
    justify-content: center;
    display: flex;
    align-items: center;
    border: solid $color-ellen-dark 2px;
    border-radius: $border-radius;
    text-align: center;
  }
}

button {
  max-width: unset;
}
</style>
