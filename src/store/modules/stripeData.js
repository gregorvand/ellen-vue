import axios from 'axios'
export const namespaced = true // ie user/[action]
import { mergeById } from '@/helpers/data_utilities'

export const state = () => ({
  cardsAndSubsResult: {},
  storedCards: {},
})

export const getters = {
  getterValue: (state) => {
    return state.value
  },
}

export const mutations = {
  SET_CARDS_SUBS: (state, payload) => {
    state.cardsAndSubsResult = payload
  },
  SET_CARDS: (state, payload) => {
    state.storedCards = payload
  },
}

export const actions = {
  async getCardsAndSubs({ commit }) {
    const cardsAndSubsResult = await axios({
      method: 'get',
      url: `${process.env.VUE_APP_API_URL}/current-cards-subscriptions`,
    })

    // finds the associated card by payment ID and merges the result so that we have
    // array of subscriptions and their payment method details in one place

    const combinedSubscriptionResult = mergeById(
      cardsAndSubsResult.data.subscriptions.data,
      cardsAndSubsResult.data.cards
    )

    console.log('combinedSubscriptionResult', combinedSubscriptionResult)

    commit('SET_CARDS_SUBS', combinedSubscriptionResult)
    commit('SET_CARDS', cardsAndSubsResult.data.cards)
  },
}
