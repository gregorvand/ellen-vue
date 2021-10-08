import axios from 'axios'
import pluralize from 'pluralize'

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
    updateCompany(component)
  },

  saveManyCompanies(component) {
    axios({
      method: 'post',
      url: `${process.env.VUE_APP_API_URL}/api/users/update/companies`,
      data: {
        selectedCompanies:
          component.$store.getters['selectedCompanies/userCompanies'],
      },
    }).then((data) => {
      companiesBulkSuccess(component, data)
    })
  },
}

function companySuccess(component) {
  component.$store.dispatch('selectedCompanies/clearCompanySelection') // ideally state becomes saved companies

  const notification = {
    type: 'success',
    message: `✅ Added ${component.company.companyName}`,
  }
  component.$store.dispatch('notification/add', notification, {
    root: true,
  })
}

function companiesBulkSuccess(component, data) {
  component.$store.dispatch('selectedCompanies/clearCompanySelection')
  component.button_label = 'Saved!'
  const companiesAddedCount = data.data.length
  const notification = {
    type: 'success',
    message: `✅ Added ${companiesAddedCount} new ${pluralize(
      'company',
      companiesAddedCount
    )}`,
  }
  component.$store.dispatch('notification/add', notification, {
    root: true,
  })
}

function updateCompany(component) {
  axios({
    method: 'post',
    url: `${process.env.VUE_APP_API_URL}/api/users/update/companies`,
    data: {
      selectedCompanies:
        component.$store.getters['selectedCompanies/userCompanies'],
    },
  }).then(() => {
    companySuccess(component)
  })
}
