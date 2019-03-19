<template>
  <div class="comment-viewer">
    <div class="comment-viewer__header">
      <div class="comment-viewer__author">
        <div class="comment-viewer__avatar-wrp">
          <span class="comment-viewer__avatar-text">
            {{ author && author.slice(0, 1) || '-' }}
          </span>
        </div>
        <span class="comment-viewer__author-email">
          {{ author || 'document-manager.unknown-author' | globalize }}
        </span>
      </div>
      <span class="comment-viewer__date">
        {{ comment.createdAt | formatCalendar }}
      </span>
    </div>
    <div class="comment-viewer__content-wrp">
      <description-viewer :metadata="comment" />
    </div>
  </div>
</template>

<script>
import { Metadata } from '../wrappers/metadata'
import DescriptionViewer from './description-viewer'
import IdentityGetter from '@/vue/mixins/identity-getter'

export default {
  name: 'comment-viewer',
  components: {
    DescriptionViewer,
  },
  mixins: [IdentityGetter],
  props: {
    comment: {
      type: Metadata,
      required: true,
    },
  },
  data: _ => ({
    author: '',
  }),
  async created () {
    if (this.comment.updaterAccountId) {
      this.author = await this
        .getEmailByAccountId(this.comment.updaterAccountId)
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss/variables';

.comment-viewer__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid $col-border-comment-viewer-header;
  padding-bottom: .5rem;
  position: relative;
}

.comment-viewer__date,
.comment-viewer__author-email {
  font-style: italic;
}

.comment-viewer__content-wrp {
  padding: 1rem 5rem;
  background: linear-gradient(to bottom,
    lighten($col-comment-content-gradient-to, 1%) 0.05%,
    $col-comment-content-gradient-to 99%
  );
}

.comment-viewer__author {
  display: flex;
  align-items: baseline;
}

.comment-viewer__avatar-wrp {
  border-radius: 50%;
  background: $col-signer-list-item-avatar-bg;
  height: 5rem;
  width: 5rem;
  position: relative;
  transform: translate(-10%, 65%);
}

.comment-viewer__avatar-text {
  color: $col-signer-list-item-avatar-text;
  font-size: 1.8rem;
  position: absolute;
  top: 50%;
  left: 50%;
  text-transform: uppercase;
  transform: translate(-48%, -51%);
}
</style>
