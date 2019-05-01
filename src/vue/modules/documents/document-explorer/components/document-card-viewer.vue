<template>
  <div class="document-card-viewer">
    <div class="document-card-viewer__header">
      <document-icon-viewer
        class="document-card-viewer__logo"
        :document="document"
      />
    </div>
    <div class="document-card-viewer__info">
      <p
        class="document-card-viewer__name"
        :title="document.name"
      >
        {{ document.name }}
      </p>

      <p
        class="document-card-viewer__type"
        :title="document.mimeType"
      >
        {{ document.mimeType }}
      </p>

      <p
        class="document-card-viewer__created"
        :title="document.createdAt"
      >
        {{ document.createdAt | formatCalendar }}
      </p>
    </div>
  </div>
</template>

<script>
import DocumentIconViewer from './document-icon-viewer'

import { Document } from '../wrappers/document'

export default {
  name: 'document-card-viewer',
  components: {
    DocumentIconViewer,
  },
  props: {
    document: { type: Document, required: true },
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';
@import '~@scss/mixins';

.document-card-viewer {
  cursor: pointer;
  border-radius: 0.4rem;
  box-shadow: 0 0.5rem 1rem 0 $col-document-card-viewer-shadow;
  background-color: $col-document-card-viewer-bg;
  margin: 1rem;
  text-decoration: none;
  color: inherit;
  min-width: 0;

  @include respond-to-custom($large) {
    flex: 0 1 calc(33.3% - 2rem);
  }
  @include respond-to-custom($x-medium) {
    flex: 0 1 calc(50% - 2rem);
  }
  @include respond-to-custom($x-small) {
    flex: 0 1 calc(100% - 2rem);
  }
}

.document-card-viewer__header {
  border-radius: 0.4rem 0.4rem 0 0;
  height: 8.5rem;
  padding-top: 1.25rem;
  background-color: $col-document-card-viewer-header-bg;
}

.document-card-viewer__logo {
  margin: 0 auto;
}

.document-card-viewer__info {
  padding: 2.2rem 1.5rem;
  max-width: 100%;
}

.document-card-viewer__name {
  font-size: 1.8rem;
  font-weight: 700;
  color: $col-document-card-viewer-text;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.document-card-viewer__type {
  margin-top: 0.5rem;
  font-size: 1.4rem;
  color: $col-document-card-viewer-text;
}

.document-card-viewer__created {
  margin-top: 1.6rem;
  font-size: 1.4rem;
  color: $col-document-card-viewer-text;
}
</style>
