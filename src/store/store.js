import Vue from 'vue'
import Vuex from 'vuex'

import * as user from '@/store/modules/user.js'
import * as notification from '@/store/modules/notification.js'
import * as search from '@/store/modules/search.js'
import * as selectedCompanies from '@/store/modules/selectedCompanies.js'
import * as followedCompanies from '@/store/modules/followedCompanies.js'
import * as datasetAccess from '@/store/modules/datasetAccess.js'
import * as selectedDataSets from '@/store/modules/selectedDataSets.js'
import * as selectedDataSetsV2 from '@/store/modules/selectedDataSetsV2.js'
import * as userCompany from '@/store/modules/userCompany.js'
import * as company from '@/store/modules/company.js'
import * as categories from '@/store/modules/categories.js'
import * as selectedCategories from '@/store/modules/selectedCategories.js'
import * as credits from '@/store/modules/credits.js'
import * as ui from '@/store/modules/ui_state.js'
import * as stripeData from '@/store/modules/stripeData.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    notification,
    search,
    selectedCompanies,
    followedCompanies,
    selectedCategories,
    datasetAccess,
    selectedDataSets,
    selectedDataSetsV2,
    userCompany,
    company,
    categories,
    credits,
    ui,
    stripeData,
  },
  state: {},
})
