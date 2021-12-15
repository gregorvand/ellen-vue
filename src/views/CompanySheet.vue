<template>
  <div class="inner-container max-width">
    <div class="container row">
      <div class="company-sheet-name">
        <h1 v-if="companyObject.data">
          {{ companyObject.data.nameIdentifier }}
        </h1>
        <h4 v-if="companyObject.data !== undefined">
          {{ companyDomain }} <br />
          <!-- {{ companyObject.data.emailIdentifier }} -->
        </h4>
        <h1 v-else><BaseLoadingSpinner /></h1>
      </div>
      <div>
        <span class="key-line"></span>
        <!-- v if company is Edison -->
        <button v-if="!isFollowed" @click="followUnfollow" ref="followButton">
          Follow
        </button>
        <span>Avg orders/month</span>
      </div>
    </div>
    <LineChart
      v-if="companyObject.data !== undefined"
      :companyObject="companyObject"
    />
    <section class="additional-metrics">
      <div class="inner-container">
        <h4>Additional metrics</h4>
        <img src="@/assets/additional_metrics.png" alt="hello" />
        <h4>
          Contact <a href="mailto:mac@ellen.me">mac@ellen.me</a> for access
        </h4>
      </div>
      <div class="inner-container">
        <h4>Trending Companies</h4>
        <TrendingCompanies />
      </div>
    </section>
    <div class="trending-companies-"></div>
  </div>
</template>

<script>
import LineChart from '@/components/ChartV3'
import TrendingCompanies from '@/components/TrendingCompanies'
import ChartDataService from '../services/ChartDataService'
import { mapState } from 'vuex'
import axios from 'axios'
// import { computed } from 'vue-demi'

export default {
  name: 'CompanyView',
  components: {
    LineChart,
    TrendingCompanies,
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
  }
}

.additional-metrics {
  margin: $global-margin auto;
  display: flex;
  flex-direction: row;
  width: 100%;

  .inner-container {
    flex-direction: column;
    width: 50%;
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
  }
}
</style>
