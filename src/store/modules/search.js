import axios from 'axios'
export const namespaced = true // ie user/[action]

// Separate axios instance that will not send default auth headers
const searchClient = axios.create({
  baseURL: `${process.env.VUE_APP_ES_SERVER}`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: 'Basic ZWxhc3RpYzpMWXpiZFRyQlpzRnhObEZISDRxNlcwYjE=',
  },
})

export const state = {
  results: [],
  currentQuery: '',
}

export const mutations = {
  SET_SEARCH_RESULTS(state, payload) {
    state.results = payload
  },
}

export const actions = {
  doSearchQuery({ commit }, currentQuery) {
    const searchQuery = {
      from: 0,
      size: 100,
      query: {
        query_string: {
          fields: ['companyName', 'ticker'],
          query: currentQuery || '',
        },
      },
    }

    return searchClient
      .post(`${process.env.VUE_APP_ES_URL}`, searchQuery)
      .then(({ data }) => {
        const results = data.hits['hits'].map((result) => result._source) // map from ES format
        commit('SET_SEARCH_RESULTS', results)
      })
  },
}
