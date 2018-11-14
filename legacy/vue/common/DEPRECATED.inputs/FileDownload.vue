<template>
  <div class="file-download">
    <a
      :href="url"
      class="file-download__link"
      download>
      <i class="mdi mdi-download" />
      <span
        class="file-download__file-name"
        :title="file.name">
        {{ file.name }}
      </span>
    </a>

    <a
      :href="url"
      class="view-btn"
      target="_blank"
      rel="noopener">
      <span>View  <i class="mdi mdi-open-in-new" /></span>
    </a>
  </div>
</template>

<script>
import { commonEvents } from 'L@/js/events/common_events'
import { dispatchAppEvent } from 'L@/js/events/helpers'
import config from '@/config'

export default {
  name: 'file-download',

  props: {
    file: {
      type: Object,
      required: true
    }
  },

  computed: {
    url () {
      if (this.file.key) return `${config.FILE_STORAGE}/${this.file.key}`
      if (this.file.url) return this.file.url
    }
  },

  methods: {
    view () {
      dispatchAppEvent(commonEvents.openFileViewEvent, this.file)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~L@scss/variables';
  @import '~L@scss/mixins';

  .file-download {
    display: flex;
  }

  .file-download__link {
    color: $col-text-field-hint;
    text-decoration: none;
    display: flex;
    align-items: center;

    i {
      font-size: 32px;
      margin-right: 10px;
    }
  }

  .view-btn {
    color: $col-text-accented;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: .8rem;
    margin-left: 15px;
    text-decoration: underline;

    i {
      font-size: .8rem;
      color: $col-text-accented;
      margin-left: 5px;
    }
  }

  .file-download__file-name {
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>
