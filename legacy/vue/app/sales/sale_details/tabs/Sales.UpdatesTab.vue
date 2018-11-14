<template>
  <div class="updates-tab">
    <add-update-form
      v-if="isAddFormOpened && updatesLoaded"
      class="updates-tab__add-form"
      :sale="sale"
      @close="closeForm"
      @timeline-add-finished="getUpdates"
    />

    <timeline
      v-if="!isAddFormOpened && updates.length > 0 && updatesLoaded"
      @timeline-add-click="openForm"
      class="updates-tab__timeline"
      :items="updates"
      :sale="sale"
    />

    <template v-if="updates.length === 0 && !isAddFormOpened && updatesLoaded">
      <div class="no-data-msg__wrapper">
        <i class="no-data-msg__icon material-icons">search</i>
        <h2 v-if="isMy">{{ i18n.sale_upd_tab_share_updates() }}</h2>
        <h2 v-else>{{ i18n.sale_upd_tab_important_updated() }}</h2>

        <md-button
          class="md-primary md-flat"
          v-if="isMy"
          @click="openForm">
          {{ i18n.sale_upd_tab_add_timeline() }}
        </md-button>
      </div>
    </template>
  </div>
</template>

<script>
import Timeline from './components/UpdatesTab.Timeline'
import AddUpdateForm from './components/UpdatesTab.Timeline.AddForm'

import { blobTypes, blobFilters } from 'L@/js/const/const'
import { usersService } from 'L@/js/services/users.service'
import { i18n } from 'L@/js/i18n'
import { mapGetters } from 'vuex'
import { vuexTypes } from 'L@/vuex/types'

export default {
  components: {
    Timeline,
    AddUpdateForm
  },
  props: {
    sale: { type: Object, default: () => {} }
  },
  data: _ => ({
    isAddFormOpened: false,
    updates: [],
    updatesLoaded: false,
    i18n
  }),
  computed: {
    ...mapGetters([
      vuexTypes.accountId
    ]),
    isMy () {
      return this.sale.owner === this.accountId
    }
  },
  watch: {
    sale: {
      handler: 'getUpdates',
      immediate: true
    }
  },
  methods: {
    async getUpdates () {
      if (!this.sale || !this.sale.id) return
      this.updates = await usersService
        .blobsOf(this.sale.owner)
        .getAll({
          [blobFilters.fundID]: this.sale.id,
          [blobFilters.type]: blobTypes.fundUpdate.num
        })
      this.updatesLoaded = true
    },
    openForm () {
      this.isAddFormOpened = true
    },
    closeForm () {
      this.isAddFormOpened = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~L@scss/variables";
  .updates-tab {
    min-height: 300px;
  }

  .updates-tab__no-updates-msg,
  .updates-tab__add-form {
    max-width: 440px;
    margin: auto;
    padding-bottom: 30px;
  }

  .empty-timeline-message {
    text-align: center;
  }

  .empty-timeline-message__icon {
    font-size: $size-icon-super-big;
  }

  .no-data-msg__wrapper {
    display: flex;
    flex-direction: column;
    text-align: center;
    color: $col-no-data-message-text;

    & > h2 {
      font-weight: 500;
    }
  }

  .no-data-msg__icon {
    font-size: $size-icon-super-big;
    color: $col-no-data-message-icon-color;
  }

</style>
