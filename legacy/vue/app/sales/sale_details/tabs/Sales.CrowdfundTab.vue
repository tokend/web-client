<template>
  <div class="crowdfund">
    <div class="crowdfund-details">
      <h3>{{ i18n.sale_corporate_details() }}</h3>
      <detail-row
        :prop="i18n.com_name()"
        :value="syndicate.name" />
      <detail-row
        :prop="i18n.com_date_of_foundation()"
        :value="syndicate.founded" />
      <detail-row
        :prop="i18n.com_homepage()"
        :value="''">
        <a :href="syndicate.homepage" target="_blank">
          {{ syndicate.homepage }}
        </a>
      </detail-row>
      <detail-row
        :prop="i18n.com_industry_tags()"
        :value="syndicate.industry" />
      <detail-row
        :prop="i18n.com_team_size()"
        :value="syndicate.teamSize" />
      <detail-row
        :prop="i18n.com_type()"
        :value="syndicate.company" />
      <detail-row
        :prop="i18n.com_headquarters()"
        :value="syndicate.headquarters" />
    </div>
    <div class="crowdfund-team">
      <h3>{{ i18n.sale_crowdfund_team() }}</h3>
      <div class="crowdfund-team-list">
        <template v-for="(item, i) in syndicate.members">
          <div
            class="crowdfund-team-member"
            :key="i">
            <img
              :src="getUrl(item)"
              alt="crowdfund team member photo"
              class="crowdfund-team-member-photo">
            <h3 class="crowdfund-team-member-name">{{ item.name }}</h3>
            <p v-if="item.isLeader">{{ i18n.sale_crowdfund_leader() }}</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import DetailRow from '../../../common/Detail.Row'
import { i18n } from 'L@/js/i18n'
import config from '@/config'
import _get from 'lodash/get'
export default {
  components: {
    DetailRow
  },
  props: {
    syndicate: { type: Object, default: () => {} }
  },
  data: _ => ({
    i18n
  }),
  methods: {
    getUrl (item) {
      const key = _get(item, 'image.key')
      return `${config.FILE_STORAGE}/${key}`
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~L@scss/variables';
  @import '~L@scss/mixins';

  .crowdfund-details {
    margin-bottom: 1rem;
  }

  .crowdfund-team-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .crowdfund-team-member {
    margin: 1rem 0;
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    @include respond-to(medium) {
      width: 100%;
    }
  }

  .crowdfund-team-member-photo {
    width: 12rem;
    height: 12rem;
    border-radius: 50%;
    margin-bottom: 1rem;
  }

</style>
