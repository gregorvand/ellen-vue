<template>
  <div>
    <div class="title-banner-group">
      <h1>Login</h1>
    </div>
    <form @submit.prevent="login">
      <label for="email"> Email: </label>
      <input v-model="email" type="email" name="email" value />

      <label for="password"> Password: </label>
      <input v-model="password" type="password" name="password" value />

      <button type="submit" name="button">Login</button>

      <p>{{ error }}</p>

      <router-link to="/register" class="small-link">
        Don't have an account? Register.
      </router-link>
      <router-link to="/forgot-password" class="small-link">
        Forgotten your password?
      </router-link>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      error: null,
    }
  },
  methods: {
    login() {
      this.$store
        .dispatch('user/login', {
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.$router.push({ name: 'dashboard' })
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
  }
}
</style>
