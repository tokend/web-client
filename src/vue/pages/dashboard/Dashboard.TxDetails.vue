<template>
  <record-details-viewer :tx="tx" />
</template>

<script>
import RecordDetailsViewer from 'L@/vue/app/common/RecordDetailsViewer'

export default {
  name: 'tx-details',
  components: {
    RecordDetailsViewer
  },
  props: {
    tx: { type: Object, required: true }
  }
}
</script>
