<template>
  <div class="comment-list-viewer">
    <template v-for="(comment, i) in comments">
      <div class="comment-list-viewer__comment-wrp" :key="i">
        <comment-viewer :comment="comment" />
      </div>
    </template>
  </div>
</template>

<script>
import CommentViewer from './comment-viewer'

export default {
  name: 'comments-viewer',
  components: {
    CommentViewer,
  },
  props: {
    comments: {
      type: Array, /** @link Metadata **/
      required: true,
    },
  },
}
</script>

<style lang="scss">
.comment-list-viewer__comment-wrp {
  margin-bottom: 2rem;
}
</style>
