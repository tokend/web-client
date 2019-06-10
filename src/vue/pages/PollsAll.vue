<template>
  <div class="polls-all">
    <div class="polls-all__filters">
      <select-field
        v-model="filters.assetCode"
        class="polls-all__filter-field app__select app__select--no-border"
      >
        <option
          v-for="balance in balances"
          :key="balance.asset.code"
          :value="balance.asset.code"
        >
          {{ balance.asset.nameAndCode }}
        </option>
      </select-field>
    </div>

    <div class="polls-all__list-wrp">
      <div
        v-for="item in list"
        :key="item.id"
      >
        {{ item }}
        <div class="polls-all__list-item-wrp">
          <div class="polls-all__poll-card">
            <p class="polls-all__poll-card-name">
              <span class="polls-all__poll-card-number">
                #{{ item.id }}
              </span>
              {{ item.creatorDetails.question }}
            </p>
          </div>

          <p class="polls-all__poll-card-time">
            <!-- TODO: translate -->
            by
            <email-getter
              is-titled
              :account-id="item.owner"
            />
          </p>

          <!-- TODO: time -->
          <!-- TODO: state -->
        </div>
      </div>
    </div>

    <div class="limits__requests-collection-loader">
      <collection-loader
        :first-page-loader="getList"
        @first-page-load="list = $event"
        @next-page-load="list = list.concat($event)"
        ref="listCollectionLoader"
      />
    </div>
  </div>
</template>

<script>
import { vuexTypes } from '@/vuex'
import { mapGetters, mapActions } from 'vuex'
import { ErrorHandler } from '@/js/helpers/error-handler'
import FormMixin from '@/vue/mixins/form.mixin'
import { api } from '@/api'
import CollectionLoader from '@/vue/common/CollectionLoader'
import EmailGetter from '@/vue/common/EmailGetter'

const POLL_STATES = {
  open: 1,
  passed: 2,
  failed: 3,
  // TODO: cancelled
}

export default {
  name: 'polls-all',

  components: {
    CollectionLoader,
    EmailGetter,
  },

  mixins: [FormMixin],

  data () {
    return {
      filters: {
        assetCode: '',
      },
      isLoading: false,
      isInitialized: false,
      list: [],
      POLL_STATES,
    }
  },

  computed: {
    ...mapGetters({
      balances: vuexTypes.accountBalances,
    }),
  },

  watch: {
    'filters.assetCode' () {
      if (!this.isInitialized) {
        return
      }
      this.reloadList()
    },

    'filters.state' () {
      if (!this.isInitialized) {
        return
      }
      this.reloadList()
    },
  },

  async created () {
    try {
      await this.initAssetCodeFilter()
      await this.reloadList()
    } catch (error) {
      ErrorHandler.processWithoutFeedback(error)
    }
    this.isInitialized = true
  },

  methods: {
    ...mapActions({
      loadBalances: vuexTypes.LOAD_ACCOUNT_BALANCES_DETAILS,
    }),

    async initAssetCodeFilter () {
      if (!this.balances.length) {
        await this.loadBalances()
      }

      this.preSetAssetCodeFilter()
    },

    preSetAssetCodeFilter () {
      if (!this.balances.length) {
        return
      }

      const isQueryAssetCodePresentInBalances = Boolean(
        this.$route.query.asset &&
        this.balances.find(i => i.asset.code === this.$route.query.asset)
      )

      this.filters.assetCode = isQueryAssetCodePresentInBalances
        ? this.$route.query.asset
        : this.balances[0].asset.code
    },

    async getList () {
      this.isLoading = true

      let result
      try {
        result = await api.getWithSignature('/v3/polls', {
          filter: {
            owner: this.balances
              .find(i => i.asset.code === this.filters.assetCode)
              .asset.owner,
          },
        })
      } catch (error) {
        ErrorHandler.processWithoutFeedback(error)
      }

      this.isLoading = false
      return result
    },

    reloadList () {
      return this.$refs.listCollectionLoader.loadFirstPage()
    },
  },
}
</script>

<style lang="scss" scoped>
.polls-all__filter-field {
  display: inline-block;
  width: auto;
}
</style>
