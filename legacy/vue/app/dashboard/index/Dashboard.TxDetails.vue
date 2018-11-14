<template>
  <record-details-viewer
    :tx="tx" />
</template>

<script>
import RecordDetailsViewer from '../../common/RecordDetailsViewer'

export default {
  name: 'tx-details',
  components: {
    RecordDetailsViewer
  },
  props: {
    tx: { type: Object, required: true }
  },
  data: _ => ({
  })
}
</script>
