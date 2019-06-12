<template>
  <div class="polls-all">
    <div class="polls-all__filters">
      <template v-if="balances.length">
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
      </template>

      <select-field
        v-model="filters.state"
        class="polls-all__filter-field app__select app__select--no-border"
      >
        <option :value="POLL_STATES.open">
          {{ 'polls-all.state-open' | globalize }}
        </option>
        <option :value="POLL_STATES.passed">
          {{ 'polls-all.state-passed' | globalize }}
        </option>
        <option :value="POLL_STATES.failed">
          {{ 'polls-all.state-failed' | globalize }}
        </option>
        <option :value="POLL_STATES.canceled">
          {{ 'polls-all.state-canceled' | globalize }}
        </option>
      </select-field>
    </div>

    <div class="polls-all__list-wrp">
      <div class="polls-all__list">
        <div
          class="polls-all__list-item-wrp"
          v-for="item in list"
          :key="item.id"
        >
          <button
            class="polls-all__poll-card"
            @click="selectItem(item)"
          >
            <p class="polls-all__poll-card-question">
              <span class="polls-all__poll-card-number">
                <!-- eslint-disable-next-line max-len -->
                {{ 'polls-all.list-item-id-prefix' | globalize({ id: item.id }) }}
              </span>
              {{ item.creatorDetails.question }}
            </p>

            <!-- eslint-disable-next-line vue/max-attributes-per-line -->
            <template v-if="item.pollState.value === POLL_STATES.open &&
              isBeforeNow(item.endTime)">
              <vue-markdown
                class="polls-all__poll-card-state"
                :source="'polls-all.ends-at-row' | globalize({
                  time: item.endTime
                })"
                :html="true"
              />
            </template>

            <template v-else>
              <vue-markdown
                class="polls-all__poll-card-state"
                :source="'polls-all.ended-at-row' | globalize({
                  time: item.endTime,
                  state: $options.filters.globalize(
                    POLL_STATES_INLINE_TRANSLATION_IDS[item.pollState.value]
                  ),
                })"
                :html="true"
              />
            </template>

            <p class="polls-all__poll-card-time">
              {{ 'polls-all.list-item-author-prefix' | globalize }}
              <email-getter
                is-titled
                :account-id="item.owner.id"
                :is-copy-button="false"
              />
            </p>
          </button>
        </div>
      </div>
      <!-- TODO: skeleton loading -->
      <!-- TODO: no-data-message -->
    </div>

    <!--
        HACK: collection loader tries to fetch the first page at any cost, but
        getList required filters.assetCode to be assigned. so the loader
        should be rendered only after filters.assetCode assigned any value
     -->
    <template v-if="filters.assetCode">
      <div class="limits__requests-collection-loader">
        <collection-loader
          :first-page-loader="getList"
          @first-page-load="list = $event"
          @next-page-load="list = list.concat($event)"
          ref="listCollectionLoader"
        />
      </div>
    </template>

    <drawer :is-shown.sync="isDrawerShown">
      <template slot="heading">
        {{ 'polls-all.vote-drawer-title' | globalize }}
      </template>

      <poll-voter :poll="pollToBrowse" />
    </drawer>
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
import VueMarkdown from 'vue-markdown'
import moment from 'moment'
import Drawer from '@/vue/common/Drawer'
import PollVoter from './polls-all/PollVoter'

// TODO: vote review

const POLL_STATES = {
  open: 1,
  passed: 2,
  failed: 3,
  canceled: 4,
}

const POLL_STATES_INLINE_TRANSLATION_IDS = {
  [POLL_STATES.open]: 'polls-all.state-inline-open',
  [POLL_STATES.passed]: 'polls-all.state-inline-passed',
  [POLL_STATES.failed]: 'polls-all.state-inline-failed',
  [POLL_STATES.canceled]: 'polls-all.state-inline-canceled',
}

export default {
  name: 'polls-all',

  components: {
    CollectionLoader,
    EmailGetter,
    VueMarkdown,
    Drawer,
    PollVoter,
  },

  mixins: [FormMixin],

  data () {
    return {
      filters: {
        assetCode: '',
        state: POLL_STATES.open,
      },
      isLoading: false,
      isInitialized: false,
      list: [],
      isDrawerShown: false,
      pollToBrowse: {},
      POLL_STATES,
      POLL_STATES_INLINE_TRANSLATION_IDS,
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
      if (!this.balances.length || this.filters.assetCode) {
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
            state: this.filters.state,
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

    isBeforeNow (date) {
      return moment().isBefore(date)
    },

    selectItem (item) {
      this.pollToBrowse = item
      this.isDrawerShown = true
    },
  },
}
</script>

<style lang="scss" scoped>
.polls-all__filter-field {
  display: inline-block;
  width: auto;
}

.polls-all__poll-card {
  display: block;
  text-align: left;
}
</style>
