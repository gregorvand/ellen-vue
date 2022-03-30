<template>
  <div class="inner-container max-width">
    <div class="container row mobile-column" :class="{ col: !loggedIn }">
      <div class="company-sheet-name">
        <h1 v-if="companyObject.data">
          {{ companyObject.data.nameIdentifier }}
        </h1>
        <h4 v-if="companyObject.data !== undefined">
          {{ companyDomain }} <br />
          <span v-if="this.user && this.user.username == 'admin'">{{
            companyObject.data.emailIdentifier
          }}</span>
        </h4>

        <h1 v-else><BaseLoadingSpinner /></h1>
      </div>
      <div class="logged-out" v-if="!loggedIn">
        <div v-if="companyObject.data">
          Access ELLEN Insights for {{ companyObject.data.nameIdentifier }}
          <br />
          Register or Login below
        </div>
      </div>
      <div v-if="loggedIn">
        <span class="key-line"></span>
        <!-- v if company is Edison -->
        <button
          v-if="!isFollowed"
          @click="followUnfollow"
          ref="followButton"
          class="no-mobile"
        >
          Follow
        </button>
        <span>Avg orders/month</span>
      </div>
    </div>
    <LineChart
      v-if="companyObject.data !== undefined && loggedIn"
      :companyObject="companyObject"
    />
    <section class="additional-metrics" v-if="loggedIn">
      <div class="inner-container">
        <h4>Additional metrics</h4>
        <AdditionalMetrics
          v-if="companyObject.data !== undefined"
          :companyObject="companyObject"
        />
      </div>
      <div class="inner-container">
        <h4>Trending Companies</h4>
        <TrendingCompanies v-if="loggedIn" />
      </div>
    </section>
    <div class="trending-companies-"></div>
    <MarketShare v-if="loggedIn" />

    <div v-if="!loggedIn">
      <RegisterUser />
    </div>
  </div>
</template>

<script>
import LineChart from '@/components/ChartV3'
import TrendingCompanies from '@/components/TrendingCompanies'
import AdditionalMetrics from '@/components/AdditionalMetrics'
import ChartDataService from '../services/ChartDataService'
import MarketShare from '@/components/MarketShare'
import RegisterUser from '@/views/RegisterUser.vue'
import { mapState } from 'vuex'
import axios from 'axios'
import { authComputed } from '@/store/helpers.js'

export default {
  name: 'CompanyView',
  components: {
    LineChart,
    TrendingCompanies,
    AdditionalMetrics,
    MarketShare,
    RegisterUser,
  },
  data: function () {
    return {
      companyObject: {},
    }
  },
  created() {
    axios
      .post(`${process.env.VUE_APP_API_URL}/api/dashboard`)
      .then(({ data }) => {
        this.$store.dispatch(
          'followedCompanies/addAllFollowedCompanies',
          data.companies
        )
      })
  },
  beforeCreate() {
    ChartDataService.getCompany(this.$route.params.id).then((company) => {
      this.companyObject = company
    })
    this.$store.dispatch('selectedDataSetsV2/updateSelectedYear', '2022')
  },
  computed: {
    companyDomain() {
      let emailSplit = this.companyObject?.data.emailIdentifier.split('@')
      return emailSplit[1]
    },
    company() {
      return {
        companyEmail: this.companyObject.emailIdentifier,
        companyName: this.companyObject.nameIdentifier,
        id: this.companyObject.id,
      }
    },
    isFollowed() {
      return this.followedCompanies.filter(
        (company) =>
          company.id.toString() == this.companyObject?.data?.id.toString()
      ).length > 0
        ? true
        : false
    },
    ...mapState('followedCompanies', ['followedCompanies']),
    ...mapState('user', ['user']),
    ...authComputed,
  },
  methods: {
    followUnfollow() {
      const companyObject = this.companyObject.data

      axios({
        method: 'post',
        url: `${process.env.VUE_APP_API_URL}/api/users/update/companies`,
        data: {
          selectedCompanies: [
            {
              companyEmail: companyObject.emailIdentifier,
            },
          ],
        },
      }).then((data) => {
        this.$refs.followButton.innerText = 'Followed!'
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.company-sheet {
  display: flex;
  width: 100%;
  justify-content: flex-start;

  &-name {
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;

    @include breakpoint(small only) {
      flex-direction: column;
      width: 100%;
    }
  }
}

.additional-metrics {
  margin: $global-margin auto;
  display: flex;
  flex-direction: column;
  width: 100%;

  @include breakpoint(medium up) {
    flex-direction: row;
  }

  .inner-container {
    flex-direction: column;
    width: 100%;

    @include breakpoint(medium up) {
      width: 50%;
    }

    h4 {
      text-align: left;
      padding-top: 10px;
    }
  }

  border-top: solid $color-ellen-dark-gray thin;
  margin-top: $global-margin;

  h4 {
    color: $color-ellen-dark;
    a {
      color: $color-black;
    }
  }

  img {
    opacity: 0.4;
    max-width: 450px;
    width: 100%;

    @include breakpoint(small only) {
      padding: 10px;
    }
  }

  .trending-companies {
    margin: 0;
  }
}

.logged-out {
  text-align: center;
  width: 100%;
}

.container.col {
  flex-direction: column;

  .company-sheet-name {
    text-align: center;
    justify-content: center;
  }
}
</style>
