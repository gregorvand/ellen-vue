<template>
  <div>
    <div class="title-banner-group">
      <h1>Reset password</h1>
    </div>
    <section class="password-form" :class="{ enabled: showForm }">
      <password
        v-model="password"
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
        @click="resetPassword"
      >
        Confirm new password
      </button>
    </section>
    <p>{{ message }}</p>
    <router-link to="/login" class="small-link" :class="{ show: showLogin }">
      Login with new password
    </router-link>
    <router-link
      to="/forgot-password"
      class="small-link"
      :class="{ show: showRedirect }"
    >
      Restart forgot password process
    </router-link>
  </div>
</template>

<script>
import Password from 'vue-password-strength-meter'
import axios from 'axios'
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
      message: null,
      showForm: true,
      showLogin: false,
      showRedirect: false,
    }
  },
  methods: {
    resetPassword() {
      axios({
        method: 'put',
        url: `${process.env.VUE_APP_API_URL}/reset-password`,
        data: {
          resetLink: this.$route.params.token,
          newPassword: this.password,
        },
      })
        .then((res) => {
          console.log(res)
          if (res.status == 200) {
            this.error = res.data.error
            this.showRedirect = true
          } else if (res.status == 201) {
            this.message = res.data.message
            this.showForm = false
            this.showLogin = true
          }
          this.message = res.data.message
        })
        .catch((err) => {
          this.showRedirect = true
          this.message = err.res
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.password-form {
  display: none;
  flex-direction: column;
  &.enabled {
    display: flex;
  }
}

button {
  max-width: unset;
}

.small-link {
  display: none;

  &.show {
    display: block;
  }
}
</style>
