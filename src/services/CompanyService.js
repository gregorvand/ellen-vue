import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${process.env.VUE_APP_API_URL}/api`,
  withCredentials: false, // This is the default
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getCompany(id) {
    return apiClient.get('/companies/' + id)
  },

  saveCompany(component) {
    component.$store.dispatch(
      'followedCompanies/addFollowedCompany',
      component.company
    )
    axios({
      method: 'post',
      url: `${process.env.VUE_APP_API_URL}/api/users/update/companies`,
      data: {
        selectedCompanies:
          component.$store.getters['selectedCompanies/userCompanies'],
      },
    }).then(({ data }) => {
      component.$store.dispatch('selectedCompanies/clearCompanySelection') // ideally state becomes saved companies
      component.button_label = 'Saved!'
      console.log(component.company)

      const notification = {
        type: 'success',
        message: `📈 Added ${component.company.companyName}`,
      }
      component.$store.dispatch('notification/add', notification, {
        root: true,
      })
    })
  },
}
