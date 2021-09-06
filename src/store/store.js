import Vue from 'vue'
import Vuex from 'vuex'

import * as user from '@/store/modules/user.js'
import * as notification from '@/store/modules/notification.js'
import * as search from '@/store/modules/search.js'
import * as selectedCompanies from '@/store/modules/selectedCompanies.js'
import * as selectedDataSets from '@/store/modules/selectedDataSets.js'
import * as userCompany from '@/store/modules/userCompany.js'
import * as company from '@/store/modules/company.js'
import * as earnings from '@/store/modules/earnings.js'
import * as categories from '@/store/modules/categories.js'
import * as selectedCategories from '@/store/modules/selectedCategories.js'
import * as compareCompany from '@/store/modules/compareCompany.js'
import * as credits from '@/store/modules/credits.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    notification,
    search,
    selectedCompanies,
    selectedCategories,
    selectedDataSets,
    userCompany,
    company,
    earnings,
    categories,
    compareCompany,
    credits,
  },
  state: {},
})
