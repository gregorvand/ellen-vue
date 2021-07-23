import { mapGetters } from 'vuex'

export const authComputed = {
  ...mapGetters({
    loggedIn: 'user/loggedIn',
  }),
}

export const allSelectedCompanies = {
  ...mapGetters({
    companies: 'user/loggedIn',
  }),
}
